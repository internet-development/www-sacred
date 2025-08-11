import Avatar from '@components/Avatar';
import ActionButton from '@components/ActionButton';
import Divider from '@components/Divider';
import DropdownMenuTrigger from '@components/DropdownMenuTrigger';
import Indent from '@components/Indent';
import Input from '@components/Input';
import Message from '@components/Message';
import MessageViewer from '@components/MessageViewer';
import ModalError from '@components/modals/ModalError';
import Navigation from '@components/Navigation';
import RowEllipsis from '@components/RowEllipsis';
import SidebarLayout from '@components/SidebarLayout';

import * as React from 'react';

interface MessagesInterfaceProps extends React.HTMLAttributes<HTMLSpanElement> {}

const ChatPreviewInline = (props) => {
  return <RowEllipsis style={{ opacity: 0.5, marginBottom: `10px` }}>{props.children}</RowEllipsis>;
};

const MessagesInterface: React.FC<MessagesInterfaceProps> = () => {
  return (
    <div style={{ minWidth: '28ch' }}>
      <Navigation
        logo="✶"
        left={
          <>
            <DropdownMenuTrigger
              items={[
                {
                  icon: '⊹',
                  children: 'Open',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'New Message',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Quick Look',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Close Messages',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Open Conversation in New Window',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Print...',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
              ]}
            >
              <ActionButton>FILE</ActionButton>
            </DropdownMenuTrigger>

            <DropdownMenuTrigger
              items={[
                {
                  icon: '⊹',
                  children: 'Undo',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Redo',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Cut',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Copy',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Paste',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Paste and Match Style',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Delete',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Select All',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Find...',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Find Next',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Find Previous',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Spelling and Grammar',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Substitutions',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Speech',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Send Message',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Reply to Last Message',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Tapback Last Message',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Edit Last Message',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Autofill',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Start Dictation',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Emoji & Symbols',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
              ]}
            >
              <ActionButton>EDIT</ActionButton>
            </DropdownMenuTrigger>
            <DropdownMenuTrigger
              items={[
                {
                  icon: '⊹',
                  children: 'Show Tab Bar',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Show All Tabs',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Make Text Bigger',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Make Text Normal Size',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Make Text Smaller',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'All Messages',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Known Senders',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Unknown Senders',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Unread Messages',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Recently Delete',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Show Sidebar',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Enter Full Screen',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
              ]}
            >
              <ActionButton>VIEW</ActionButton>
            </DropdownMenuTrigger>
          </>
        }
        right={
          <>
            <DropdownMenuTrigger
              items={[
                {
                  icon: '⊹',
                  children: 'Search',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Messages Help',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
              ]}
            >
              <ActionButton>HELP</ActionButton>
            </DropdownMenuTrigger>
          </>
        }
      ></Navigation>
      <Divider type="DOUBLE" />
      <SidebarLayout
        defaultSidebarWidth={12}
        isShowingHandle={true}
        sidebar={
          <>
            <Avatar>
              <Indent>
                Arthur
                <br />
                <ChatPreviewInline>No, it has to be more unique</ChatPreviewInline>
              </Indent>
            </Avatar>
            <Avatar>
              <Indent>
                Ariadne
                <br />
                <ChatPreviewInline>No. Just you.</ChatPreviewInline>
              </Indent>
            </Avatar>
            <Avatar>
              <Indent>
                Eames
                <br />
                <ChatPreviewInline>dream a little bigger</ChatPreviewInline>
              </Indent>
            </Avatar>
            <Avatar>
              <Indent>
                Yusef
                <br />
                <ChatPreviewInline>Depends on the dream.</ChatPreviewInline>
              </Indent>
            </Avatar>
            <Avatar>
              <Indent>
                Saito
                <br />
                <ChatPreviewInline>I bought the airline.</ChatPreviewInline>
              </Indent>
            </Avatar>
          </>
        }
      >
        <Message>Why are they all looking at me?</Message>
        <MessageViewer>Because my subconscious feels that someone else is creating this world. The more you change things, the quicker the projections start to converge on you.</MessageViewer>
        <Message>Converge?</Message>
        <MessageViewer>It's the foreign nature of the dreamer. They attack like white blood cells fighting an infection.</MessageViewer>
        <Message>They're going to attack us?</Message>
        <MessageViewer>No. Just you.</MessageViewer>
        <br />
        <br />
        <Input autoComplete="off" isBlink={true} label="Message" name="test_message_interface" />
      </SidebarLayout>
    </div>
  );
};

export default MessagesInterface;
