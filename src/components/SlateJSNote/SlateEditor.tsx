// Majority of this file came from the official example code:
// https://github.com/ianstormtaylor/slate/blob/master/site/components.tsx
// https://github.com/ianstormtaylor/slate/blob/master/site/examples/richtext.tsx

import { Box, IconButton } from "@chakra-ui/react";
import isHotkey from "is-hotkey";
import React, { useCallback, useMemo, useState } from "react";
import {
  AiOutlineBars,
  AiOutlineBlock,
  AiOutlineBold,
  AiOutlineCode,
  AiOutlineItalic,
  AiOutlineOrderedList,
  AiOutlineUnderline,
} from "react-icons/ai";
import { BiHeading } from "react-icons/bi";
import { FaHeading } from "react-icons/fa";
import {
  createEditor,
  Editor,
  Element as SlateElement,
  Node,
  Transforms,
} from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, useSlate, withReact } from "slate-react";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];

interface Props {
  slateValue: Note[];
  setSlateValue: React.Dispatch<React.SetStateAction<Note[]>>;
}

const SlateEditor = ({ slateValue, setSlateValue }: Props) => {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Slate
      editor={editor}
      value={slateValue}
      onChange={(value) => setSlateValue(value)}
    >
      <Box
        position="relative"
        padding="1px 18px 17px"
        margin="0 -20px"
        borderBottom="2px solid #eee"
        marginBottom="20px"
      >
        <MarkButton format="bold" icon={<AiOutlineBold />} />
        <MarkButton format="italic" icon={<AiOutlineItalic />} />
        <MarkButton format="underline" icon={<AiOutlineUnderline />} />
        <MarkButton format="code" icon={<AiOutlineCode />} />
        {/* FIXME: somehow this three button is not working */}
        {/* <BlockButton format="heading-one" icon={<FaHeading />} />
        <BlockButton format="heading-two" icon={<BiHeading />} />
        <BlockButton format="block-quote" icon={<AiOutlineBlock />} /> */}
        <BlockButton format="numbered-list" icon={<AiOutlineOrderedList />} />
        <BlockButton format="bulleted-list" icon={<AiOutlineBars />} />
      </Box>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
      />
    </Slate>
  );
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      LIST_TYPES.includes(
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
      ),
    split: true,
  });
  const newProperties: Partial<SlateElement> = {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  };
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <IconButton
      icon={icon}
      color="black"
      aria-label={format}
      verticalAlign="text-bottom"
      size="lg"
      _active={{ color: "#3d3d3d" }}
      active={isBlockActive(editor, format).toString()}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    ></IconButton>
  );
};

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <IconButton
      icon={icon}
      color="black"
      aria-label={format}
      verticalAlign="text-bottom"
      size="lg"
      _active={{ color: "#3d3d3d" }}
      active={isMarkActive(editor, format).toString()}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    ></IconButton>
  );
};

export default SlateEditor;
