"use client";

import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

import ShellSelector from "./ShellSelector";
import { useTerminalStore } from "@/store/terminal.store";

type ServerMessage =
  | { type: "data"; data: string }
  | { type: "exit"; code: number }
  | { type: "error"; message: string };

function flushPendingRun(ws: WebSocket) {
  const pending = useTerminalStore.getState().runRequest;
  if (pending && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "run", code: pending }));
    useTerminalStore.getState().clearRunRequest();
  }
}

export default function TerminalPanel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const shell = useTerminalStore((s) => s.shell);
  const runRequest = useTerminalStore((s) => s.runRequest);

  useEffect(() => {
    if (!containerRef.current) return;

    const term = new XTerm({
      convertEol: true,
      fontSize: 13,
      cursorBlink: true,
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(containerRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    const ws = new WebSocket("ws://localhost:3001");
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "start",
          shell: useTerminalStore.getState().shell,
          cols: term.cols,
          rows: term.rows,
        }),
      );
      flushPendingRun(ws);
    };

    ws.onmessage = (event) => {
      const msg: ServerMessage = JSON.parse(event.data);
      switch (msg.type) {
        case "data":
          term.write(msg.data);
          break;
        case "exit":
          term.writeln(`\r\n[Process exited with code ${msg.code}]`);
          break;
        case "error":
          term.writeln(`\r\n[${msg.message}]`);
          break;
      }
    };

    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "input", data }));
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "resize", cols: term.cols, rows: term.rows }));
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      ws.close();
      term.dispose();
      xtermRef.current = null;
      fitAddonRef.current = null;
      wsRef.current = null;
    };
  }, []);

  useEffect(() => {
    const ws = wsRef.current;
    const term = xtermRef.current;
    if (!ws || !term || ws.readyState !== WebSocket.OPEN) return;

    term.clear();
    ws.send(JSON.stringify({ type: "start", shell, cols: term.cols, rows: term.rows }));
  }, [shell]);

  useEffect(() => {
    const ws = wsRef.current;
    if (!ws || !runRequest) return;
    flushPendingRun(ws);
  }, [runRequest]);

  return (
    <div className="flex h-full flex-col border-t border-border bg-background">
      <div className="flex h-8 items-center justify-between border-b border-border px-3 text-xs text-muted-foreground">
        Terminal
        <ShellSelector />
      </div>
      <div className="min-h-0 flex-1 p-1">
        <div ref={containerRef} className="h-full w-full" />
      </div>
    </div>
  );
}
