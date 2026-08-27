/* @refresh reload */
import { render } from "solid-js/web"
import "./tokens/tokens.css"
import "./tokens/base.css"
import { App } from "./shell/App"

const root = document.getElementById("root")

render(() => <App />, root!)
