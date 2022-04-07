import React, { useState, useEffect } from 'react';
import {
  EditorState,
  ContentState,
  convertFromHTML,
  convertToRaw,
} from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import draftToHtml from 'draftjs-to-html';
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from '@draft-js-plugins/mention';
import createToolbarPlugin, {
  Separator,
} from '@draft-js-plugins/static-toolbar';
import 'draft-js/dist/Draft.css';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from '@draft-js-plugins/buttons';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';

const RichTextEditorComment = ({
  accounts,
  returnContent,
  convertedContent,
  editorLength,
  clearEditorState,
}) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [open, setOpen] = useState(false);

  const [suggestions, setSuggestions] = useState({});

  const Entry = (props) => {
    const {
      mention,
      theme,
      isFocused,
      searchValue, // eslint-disable-line no-unused-vars
      ...parentProps
    } = props;
    return (
      <div {...parentProps}>
        <div
          className={
            'py-1 px-4 flex relative z-50 cursor-pointer hover:bg-primary hover:bg-opacity-10 transition duration-500 ease-in-ou'
          }
        >
          <div className={'flex flex-col justify-center'}>
            <img
              src={mention.avatar}
              alt='Accounts'
              role='presentation'
              style={{ width: '36px', height: 'auto', borderRadius: '50%' }}
            />
          </div>
          <div className={'pl-2 flex flex-col justify-center'}>
            <div className={'text-xxs font-bold'}>{mention.name}</div>
            <div className={'text-xxs opacity-60'}>{mention.email}</div>
          </div>
        </div>
      </div>
    );
  };

  const [{ plugins, MentionSuggestions, Toolbar }] = useState(() => {
    const mentionPlugin = createMentionPlugin({
      entityMutability: 'IMMUTABLE',
      mentionPrefix: '@',
      supportWhitespace: true,
    });
    const toolbarPlugin = createToolbarPlugin();

    const { MentionSuggestions } = mentionPlugin;
    const { Toolbar } = toolbarPlugin;
    const plugins = [mentionPlugin, toolbarPlugin];
    return {
      plugins,
      MentionSuggestions,
      Toolbar,
    };
  });

  const onOpenChange = () => {
    setOpen(!open);
  };

  const onSearchChange = ({ value }) => {
    setSuggestions(defaultSuggestionsFilter(value, suggestions));
  };

  const handleEditorChange = (state) => {
    setEditorState(state);
    let currentContentAsHTML = JSON.stringify(
      draftToHtml(convertToRaw(editorState.getCurrentContent()))
    );
    const contentState = editorState.getCurrentContent();
    const contentRaw = convertToRaw(contentState);

    let mentionedAccounts = [];
    for (let key in contentRaw.entityMap) {
      const ent = contentRaw.entityMap[key];
      if (ent.type === 'mention') {
        const { accountId } = ent.data.mention;
        mentionedAccounts.push(accountId);
      }
    }
    convertedContent({
      content: currentContentAsHTML,
      mentions: mentionedAccounts,
    });
  };

  useEffect(() => {
    if (returnContent !== undefined && returnContent.length >= 1) {
      const contentBlocks = convertFromHTML(JSON.parse(returnContent));

      const contentState = ContentState.createFromBlockArray(
        contentBlocks.contentBlocks,
        contentBlocks.entityMap
      );
      setEditorState(EditorState.createWithContent(contentState));
    }

    editorLength(editorState.getCurrentContent().getPlainText().length);
  }, [returnContent, editorState]);

  useEffect(() => {
    if (clearEditorState) {
      const clearState = EditorState.push(
        editorState,
        ContentState.createFromText('')
      );
      setEditorState(clearState);
    }
  }, [clearEditorState]);

  useEffect(() => {
    if (accounts) {
      const mentions = [];
      for (var i = 0; i < accounts.length; i++) {
        mentions.push({
          accountId: accounts[i]._id,
          name: `${accounts[i].firstName} ${accounts[i].lastName}`,
          email: accounts[i].email,
          avatar: accounts[i].accountProfileUploaded,
          jobTitle: accounts[i].workInfo.jobTitle,
        });
      }

      setSuggestions(mentions);
    }
  }, [accounts]);

  return (
    <>
      <div className='description-container bg-lightGrey w-full text-sm p-3 relative rounded-md'>
        <MentionSuggestions
          open={open}
          onOpenChange={onOpenChange}
          suggestions={suggestions}
          onSearchChange={onSearchChange}
          entryComponent={Entry}
          popoverContainer={({ children }) => (
            <div className='bg-veryLightGrey mt-24 ml-4 py-3 absolute z-50 rounded-md'>
              {children}
            </div>
          )}
        />

        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          plugins={plugins}
          placeholder='Add a comment...'
        />

        <Toolbar>
          {(externalProps) => (
            <div
              style={{
                background: '#FFF',
                padding: '0.5rem 0.4rem',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '0.4rem',
              }}
            >
              <BoldButton {...externalProps} />
              <ItalicButton {...externalProps} />
              <UnderlineButton {...externalProps} />
              <CodeButton {...externalProps} />
              <Separator {...externalProps} />
              <UnorderedListButton {...externalProps} />
              <OrderedListButton {...externalProps} />
              <BlockquoteButton {...externalProps} />
              <CodeBlockButton {...externalProps} />
            </div>
          )}
        </Toolbar>
      </div>
    </>
  );
};

export default RichTextEditorComment;
