// ** React Imports
import React, { useEffect, useState } from 'react';

// ** Third Party Imports
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg';

interface IEditor {
  htmlStr: string;
  setHtmlStr: React.Dispatch<React.SetStateAction<string>>;
}

// 에디터 컴포넌트
const EditorControlled = (props: IEditor) => {
  // ** Props
  const { htmlStr, setHtmlStr } = props;

  // ** State
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // ** Hooks
  useEffect(() => {
    const blocksFromHtml = htmlToDraft(htmlStr);
    if (blocksFromHtml) {
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  }, []);

  // editor 수정 이벤트
  const onEditorStateChange = (editorState: EditorState) => {
    setEditorState(editorState);
    setHtmlStr(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  };

  return (
    <ReactDraftWysiwyg
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      placeholder="내용을 입력해주세요."
    />
  );
};

export default EditorControlled;
