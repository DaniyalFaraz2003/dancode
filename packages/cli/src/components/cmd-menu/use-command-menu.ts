import { useRef, useState, useMemo, useLayoutEffect, type RefObject } from "react";
import type { ScrollBoxRenderable } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { filterCommands } from "./filter-commands";
import type { Command } from "./types";

type UseCommandMenuReturn = {
    showCommandMenu: boolean;
    commandQuery: string;
    selectedIndex: number;
    scrollRef: RefObject<ScrollBoxRenderable | null>;
    handleContentChange: (text: string) => void;
    resolveCommand: (index: number) => Command | undefined;
    setSelectedIndex: (index: number) => void;
};

export function useCommandMenu(): UseCommandMenuReturn {
    const [textValue, setTextValue] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showCommandMenu, setShowCommandMenu] = useState(false);
    const scrollRef = useRef<ScrollBoxRenderable | null>(null);

    const commandQuery = showCommandMenu ? (textValue.startsWith("/") ? textValue.slice(1) : "") : "";

    const filteredCommands = useMemo(() => filterCommands(commandQuery), [commandQuery]);

    const handleContentChange = (text: string) => {
        setTextValue(text);
        setSelectedIndex(0);

        const prefix = text.startsWith("/") ? text.slice(1) : null;

        if (prefix !== null && !prefix.includes(" ")) {
            setShowCommandMenu(true);
        } else {
            setShowCommandMenu(false);
        }
    };

    const resolveCommand = (index: number): Command | undefined => {
        const command = filteredCommands[index];
        if (command) {
            setShowCommandMenu(false);
        }
        return command;
    };

    useLayoutEffect(() => {
        if (!showCommandMenu) return;

        const command = filteredCommands[selectedIndex];
        const scrollBox = scrollRef.current;
        if (!command || !scrollBox) return;

        scrollBox.scrollChildIntoView(command.value);
    }, [selectedIndex, showCommandMenu, filteredCommands]);

    useKeyboard((key) => {
        if (!showCommandMenu) return;

        if (key.name == "escape") {
            key.preventDefault();
            setShowCommandMenu(false);
        } else if (key.name == "up") {
            key.preventDefault();
            setSelectedIndex((i) => Math.max(0, i - 1));
        } else if (key.name == "down") {
            key.preventDefault();
            setSelectedIndex((i) => Math.min(filteredCommands.length - 1, i + 1));
        }
    });

    return { showCommandMenu, commandQuery, selectedIndex, scrollRef, handleContentChange, resolveCommand, setSelectedIndex };
}