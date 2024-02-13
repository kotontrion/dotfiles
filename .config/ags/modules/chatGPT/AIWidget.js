import Widget, {Button, Box, Label, Scrollable} from "resource:///com/github/Aylur/ags/widget.js";
import ChatGPT from "./AIService.js";
import Keys from "../../keys.js";
import {QSState} from "../quicksettings/index.js";
import App from "resource:///com/github/Aylur/ags/app.js";
import Gtk from "gi://Gtk?version=3.0";
import { TextView } from "..//widgets/widgets.js";
import Gdk from "gi://Gdk";
import {readFile} from "resource:///com/github/Aylur/ags/utils.js";
import {Marked} from "../../node_modules/marked/lib/marked.esm.js";
// @ts-ignore
import {markedHighlight} from "../../node_modules/marked-highlight/src/index.js";
//highlightjs requires some modifications to work with gjs, mainly just how it's exported
import hljs from "../highlight.js/lib/index.js";
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
import Menu from "../quicksettings/menu.js";
import { QuickSettingsPage } from "../quicksettings/quicksettings.js";
import icons from "../icons/index.js";


let AIContainer;

/**
* @param {import('modules/widgets/widgets').TextView} textView
*/
function sendMessage(textView) {
  const buffer = textView.get_buffer();
  const [start, end] = buffer.get_bounds();
  const text = buffer.get_text(start, end, true);
  if (!text || text.length == 0) return;
  if(text.startsWith("/system")){
    ChatGPT.setSystemMessage(text.substring(7));
  }
  else {
    ChatGPT.send(text);
  }
  buffer.set_text("", -1);
}


try {
  const WebKit2 = (await import("gi://WebKit2?version=4.1")).default;

  const WebView = Widget.subclass(WebKit2.WebView, "AgsWebView");


  const parser = new Marked(
    markedHighlight({
      langPrefix: "hljs language-",
      /**
     * @param {string} code
     * @param {string} lang
     */
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, {language}).value;
      }
    })
  );
  const renderer = {
  /**
   * @param {string} code
   * @param {string} language
   */
    code(code, language) {
      language ||= "plaintext";
      const encoded = encodeURIComponent(code);
      return `
        <div class="code">
            <div class="code-header"><span data-language="${language}">${language}</span><button onClick="copyCode(this, '${encoded}')">Copy</button></div>
            <pre><code>${code}</code></pre>
        </div>`;
    }
  };

  parser.use({renderer});


  const styleString = readFile(`${App.configDir}/highlight.css`);
  const stylesheet = new WebKit2.UserStyleSheet(
    styleString, 0, 0, null, null);

  /**
  * @param {import('modules/chatGPT/AIService').ChatGPTMessage} msg
  * @param {import('types/widget').Scrollable} scrollable
  */
  const MessageContent = (msg, scrollable) => {
    const view = WebView({
      class_name: "ai-msg-content",
      hexpand: true
    })
      .hook(msg, (view) => {
        const content = `<script>
            function copyCode(button, encodedCode) {
              const decodedCode = decodeURIComponent(encodedCode);
              const tempElement = document.createElement('pre');
              tempElement.innerHTML = decodedCode;
              navigator.clipboard.writeText(tempElement.innerText);
              button.innerText = 'Copied';
              setTimeout(() => button.innerText = 'Copy', 2000);
            }</script>` + parser.parse(msg.content);
        view.load_html(content, "file://");
      }, "notify::content")
      .on("load-changed", /** @param {WebKit2.WebView} view, @param {WebKit2.LoadEvent} event*/(view, event) => {
        if (event === 3) {
          view.evaluate_javascript("document.body.scrollHeight", -1, null, null, null, (view, result) => {
            const height = view.evaluate_javascript_finish(result)?.to_int32() || -1;
            view.get_parent().css = `min-height: ${height}px;`;
            // @ts-ignore
            const adjustment = scrollable.get_vadjustment();
            adjustment.set_value(adjustment.get_upper() - adjustment.get_page_size());
          });
        }
      })
    // HACK: evil way to disable context menu
      .on("context-menu", (view, menu) => {
        menu.remove_all();
      })
      .on("decide-policy", (view, decision, type) => {
        if(type != 0) {
          decision.ignore();
          return;
        }
        const uri = decision.get_request().get_uri();
        if (uri === "file:///") {
          decision.use();
          return;
        }
        decision.ignore();
        execAsync(["xdg-open", uri]);
      });
    view.get_settings().set_javascript_can_access_clipboard(true);
    view.get_settings().set_enable_write_console_messages_to_stdout(true);
    view.get_user_content_manager().add_style_sheet(stylesheet);
    // HACK: style context is only accessable after the widget was added to the
    // hierachy, so i do this to set the color once.
    view.on("realize", () => {
      const bgCol = view.get_style_context().get_property("background-color", Gtk.StateFlags.NORMAL);
      view.set_background_color(bgCol);
    });
    return Box({
      css: "padding: 1px",
      children: [view]
    });
  };

  /**
  * @param {import('modules/chatGPT/AIService').ChatGPTMessage} msg
  * @param {import('types/widget').Scrollable} scrollable
  */
  const Message = (msg, scrollable) => Box({
    class_name: `ai-message ${msg.role}`,
    vertical: true,
    children: [
      Label({
        label: Keys[msg.role] || msg.role,
        xalign: 0,
        class_name: `ai-role ${msg.role}`,
        hexpand: true,
        wrap: true,
      }),
      MessageContent(msg, scrollable),
    ]
  });

  const TextEntry = () => {
    const placeholder = "Ask ChatGPT";
    const textView = TextView({
      class_name: "ai-entry",
      wrap_mode: Gtk.WrapMode.WORD_CHAR,
      hexpand: true,
    })
      .on("focus-in-event", () => {
        const buffer = textView.get_buffer();
        const [start, end] = buffer.get_bounds();
        const text = buffer.get_text(start, end, true);
        if(text === placeholder) buffer.set_text("", -1);
      })
      .on("focus-out-event", () => {
        const buffer = textView.get_buffer();
        const [start, end] = buffer.get_bounds();
        const text = buffer.get_text(start, end, true);
        if(text === "") buffer.set_text(placeholder, -1);
      })
      .on("key-press-event", (entry, event) => {
        const keyval = event.get_keyval()[1];
        if (
          (keyval === Gdk.KEY_C)
      && ((event.get_state()[1]) === (Gdk.ModifierType.CONTROL_MASK | Gdk.ModifierType.SHIFT_MASK | Gdk.ModifierType.MOD2_MASK))) {
          ChatGPT.clear();
        }
        else if (event.get_keyval()[1] === Gdk.KEY_Return && event.get_state()[1] == Gdk.ModifierType.MOD2_MASK) {
          sendMessage(entry);
          return true;
        }

      })
      .hook(QSState, (entry) => {
        if (QSState.value === "ChatGPT")
          entry.grab_focus();
      })
      .hook(App, (entry, window, visible) => {
        if (window === "quicksettings" && visible && QSState.value === "ChatGPT")
          entry.grab_focus();
      });

    return Scrollable({
      child: textView,
      max_content_height: 100,
      propagate_natural_height: true,
      vscroll: "automatic",
      hscroll: "never",
    });
  };


  AIContainer = () => Box({
    class_name: "ai-container",
    vertical: true,
    children: [
      Scrollable({
        class_name: "ai-message-list",
        hscroll: "never",
        vscroll: "always",
        vexpand: true,
        setup: self => {
          const viewport = self.child;
          //prevent jump to the top of clicked element
          // @ts-ignore
          viewport.set_focus_vadjustment(new Gtk.Adjustment(undefined));
        },
        child: Box({vertical: true})
          .hook(ChatGPT, (box, idx) => {
            const msg = ChatGPT.messages[idx];
            if (!msg) return;
            const msgWidget = Message(msg, box.get_parent());
            box.add(msgWidget);
          }, "newMsg")
          .hook(ChatGPT, box => {
            box.children = [];
          }, "clear")
      }),
      Box({
        spacing: 5,
        class_name: "ai-entry-box",
        children: [
          TextEntry(),
          Button({
            class_name: "ai-send-button",
            on_clicked: (btn) => {
              // @ts-ignore
              const textView = btn.get_parent().children[0].child;
              sendMessage(textView);
            },
            label: "󰒊",
          }),
        ]
      }),
    ],
  });
}
catch(e) {
  AIContainer = () => Widget.Box();
  console.warn("webkit2gtk-4.1 is not installed. ChatGPT module has been disabled.");
}

/**
 * @returns {import('types/@girs/gtk-3.0/gtk-3.0').Gtk.Widget}
 */
const QSChatGPT = () => QuickSettingsPage(
  Menu({
    title: "ChatGPT",
    icon: icons.ai,
    content: AIContainer(),
    headerChild: Widget.Button({
      on_clicked: () => ChatGPT.clear(),
      child: Widget.Box({
        children: [
          Widget.Label("Clear "),
          Widget.Icon(icons.trash.empty),
        ]
      }),
    }),
  })
);

export default AIContainer;
export {
  AIContainer,
  QSChatGPT,
};
