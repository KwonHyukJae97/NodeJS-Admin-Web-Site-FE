// ** React Imports
import React, { useEffect, useState } from 'react';

// ** Third Party Imports
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg';

// props 타입 정의
interface EditorControlledProps {
  initStr: string;
  setHtmlStr: React.Dispatch<React.SetStateAction<string>>;
}

// 에디터 UI 컴포넌트
const EditorControlled = (props: EditorControlledProps) => {
  // ** Props
  const { initStr, setHtmlStr } = props;

  // ** State
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // ** Hooks
  useEffect(() => {
    if (initStr !== '') {
      // 문자열을 html 코드로 변환 (수정)
      const blocksFromHtml = htmlToDraft(initStr);
      if (blocksFromHtml) {
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
      }
    }
  }, [initStr]);

  // editor에 입력했을 때, html 코드로 변환 (등록/수정)
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
