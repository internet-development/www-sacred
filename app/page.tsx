import '@root/global.scss';

import * as Constants from '@common/constants';
import * as Utilities from '@common/utilities';

// NOTE(jimmylee): This is a kitchen sink of all components.
// When forking or remixing, you'll likely only need a few.
import Accordion from '@components/Accordion';
import ActionBar from '@components/ActionBar';
import ActionButton from '@components/ActionButton';
import ActionListItem from '@components/ActionListItem';
import AlertBanner from '@components/AlertBanner';
import AS400 from '@components/examples/AS400';
import Avatar from '@components/Avatar';
import Badge from '@components/Badge';
import BarLoader from '@components/BarLoader';
import BarProgress from '@components/BarProgress';
import Block from '@components/Block';
import BlockLoader from '@components/BlockLoader';
import Breadcrumbs from '@components/BreadCrumbs';
import Button from '@components/Button';
import ButtonGroup from '@components/ButtonGroup';
import Card from '@components/Card';
import CardDouble from '@components/CardDouble';
import Checkbox from '@components/Checkbox';
import Chessboard from '@components/Chessboard';
import CodeBlock from '@components/CodeBlock';
import ContentFluid from '@components/ContentFluid';
import ComboBox from '@components/ComboBox';
import DataTable from '@components/DataTable';
import DatePicker from '@components/DatePicker';
import DashboardRadar from '@components/examples/DashboardRadar';
import DebugGrid from '@components/DebugGrid';
import DefaultActionBar from '@components/page/DefaultActionBar';
import DefaultLayout from '@components/page/DefaultLayout';
import Denabase from '@components/examples/Denabase';
import Dialog from '@components/Dialog';
import Divider from '@components/Divider';
import Drawer from '@components/Drawer';
import DropdownMenuTrigger from '@components/DropdownMenuTrigger';
import Grid from '@components/Grid';
import HoverComponentTrigger from '@components/HoverComponentTrigger';
import Indent from '@components/Indent';
import Input from '@components/Input';
import IntDevLogo from '@components/svg/IntDevLogo';
import ListItem from '@components/ListItem';
import Message from '@components/Message';
import MessageViewer from '@components/MessageViewer';
import MessagesInterface from '@components/examples/MessagesInterface';
import ModalAlert from '@components/modals/ModalAlert';
import ModalCanvasSnake from '@components/modals/ModalCanvasSnake';
import ModalCanvasPlatformer from '@components/modals/ModalCanvasPlatformer';
import ModalChess from '@components/modals/ModalChess';
import ModalCreateAccount from '@components/modals/ModalCreateAccount';
import ModalError from '@components/modals/ModalError';
import ModalMatrixModes from '@components/modals/ModalMatrixModes';
import ModalStack from '@components/ModalStack';
import ModalTrigger from '@components/ModalTrigger';
import Navigation from '@components/Navigation';
import NumberRangeSlider from '@components/NumberRangeSlider';
import Package from '@root/package.json';
import RadioButtonGroup from '@components/RadioButtonGroup';
import Row from '@components/Row';
import RowSpaceBetween from '@components/RowSpaceBetween';
import Script from 'next/script';
import Select from '@components/Select';
import SidebarLayout from '@components/SidebarLayout';
import Table from '@components/Table';
import TableRow from '@components/TableRow';
import TableColumn from '@components/TableColumn';
import Text from '@components/Text';
import TextArea from '@components/TextArea';
import TreeView from '@components/TreeView';
import UpdatingDataTable from '@components/examples/UpdatingDataTable';
import ModalDOMSnake from '@root/components/modals/ModalDOMSnake';

export const dynamic = 'force-static';

// NOTE(jimmylee)
// https://nextjs.org/docs/app/api-reference/functions/generate-metadata
export async function generateMetadata({ params, searchParams }) {
  const title = Package.name;
  const description = Package.description;
  const url = 'https://sacred.computer';
  const handle = '@internetxstudio';

  return {
    description,
    icons: {
      apple: [{ url: '/apple-touch-icon.png' }, { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
      icon: '/favicon-32x32.png',
      other: [
        {
          rel: 'apple-touch-icon-precomposed',
          url: '/apple-touch-icon-precomposed.png',
        },
      ],
      shortcut: '/favicon-16x16.png',
    },
    metadataBase: new URL('https://sacred.computer'),
    openGraph: {
      description,
      images: [
        {
          url: 'https://intdev-global.s3.us-west-2.amazonaws.com/public/internet-dev/57a5715d-d332-47d0-8ec8-40cfa75bf36f.png',
          width: 1500,
          height: 785,
        },
      ],
      title,
      type: 'website',
      url,
    },
    title,
    twitter: {
      card: 'summary_large_image',
      description,
      handle,
      images: ['https://intdev-global.s3.us-west-2.amazonaws.com/public/internet-dev/57a5715d-d332-47d0-8ec8-40cfa75bf36f.png'],
      title,
      url,
    },
    url,
  };
}

// NOTE(jimmylee)
// https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts
export default async function Page(props) {
  return (
    <DefaultLayout previewPixelSRC="https://intdev-global.s3.us-west-2.amazonaws.com/template-app-icon.png">
      <br />
      <Grid>
        <Row>
          {Package.name.toUpperCase()} <Badge>{Package.version}</Badge>
        </Row>
        <Row>{Package.description}</Row>
      </Grid>

      <DebugGrid />
      <DefaultActionBar />

      <Grid>
        <ActionListItem icon={`⭢`} href="https://internet.dev" target="_blank">
          Hire our studio to build your applications
        </ActionListItem>
        <ActionListItem icon={`⭢`} href="https://github.com/internet-development/www-sacred" target="_blank">
          View the SRCL source code
        </ActionListItem>
        <ActionListItem icon={`⭢`} href="https://vercel.com/home" target="_blank">
          Try our hosting provider Vercel
        </ActionListItem>
      </Grid>
      <Grid>
        <Accordion defaultValue={true} title="ACTION BAR">
          The action bar is a container for primary and secondary actions styled with a monospace font. Positioned at the top or bottom of an interface, it organizes elements like menu options, navigation buttons, titles, or search fields.
          <br />
          <br />
          <Card title="EXAMPLE">
            <ActionBar
              items={[
                {
                  hotkey: '⌘+1',
                  body: 'Example I',
                },
                {
                  hotkey: '⌘+2',
                  body: 'Example II',
                },
                {
                  hotkey: '⌘+3',
                  body: 'Example III',
                },
              ]}
            />
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="ACCORDION">
          Accordion components are vertically stacked, expandable panels designed for efficient use of space in monospace-driven layouts, often inspired by classic terminal interfaces. Each panel consists of a header and its corresponding content area, allowing users to toggle between a condensed summary and detailed information.
          <br />
          <br />
          <Card title="EXAMPLE">
            <Accordion defaultValue={false} title="ACCORDION EXAMPLE">
              There are two visions of America a half century from now. One is of a society more divided between the haves and the have-nots, a country in which the rich live in gated communities, send their children to expensive schools, and have access to first-rate medical care. Meanwhile, the rest live in a world marked by insecurity, at best mediocre education, and in effect rationed health care―they hope and pray they don't get seriously sick. At the bottom are millions of young people alienated and without hope. I have seen that picture in many developing countries; economists have given it a name, a dual economy, two societies living side by side, but hardly knowing each other, hardly imagining what life is like for the other. Whether we will fall to the depths of some countries, where the gates grow higher and the societies split farther and farther apart, I do not know. It is, however, the nightmare towards which we are slowly marching.
            </Accordion>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="ACTION BUTTONS">
          Action buttons let users perform actions. They are used for task-based options within a workflow and work well in interfaces where buttons need to stay understated.
          <br />
          <br />
          <Card title="EXAMPLE">
            <ActionButton hotkey="⌘+S">Save</ActionButton>
            <br />
            <ActionButton hotkey={<BlockLoader mode={9} />}>Loading</ActionButton>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="ACTION LIST">
          Action lists are a vertical list of interactive actions or options. It displays items in a single-column format with space for icons, descriptions, side information, and other visuals. The monospace font ensures clarity and consistency.
          <br />
          <br />
          <Card title="EXAMPLE">
            <ActionListItem icon={`⭡`}>Hide item example</ActionListItem>
            <ActionListItem icon={`⭢`}>Next item example</ActionListItem>
            <ActionListItem icon={`⭣`}>Show item example</ActionListItem>
            <ActionListItem icon={`⭠`} href="/">
              Return item example
            </ActionListItem>
            <ActionListItem icon={`⊹`}>Action item example</ActionListItem>
            <ActionListItem icon={`⊹`} href="https://internet.dev" target="_blank">
              Visit the studio website
            </ActionListItem>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="ALERT BANNER">
          Alert banners display important messages across the user interface. It communicates system-wide issues, errors, warnings, or informational updates. Typically placed at the top of a page, it includes a clear message and may provide an action for the user. Alert Banners can be dismissed after being read, helping users stay informed about significant changes or information.
          <br />
          <br />
          <Card title="EXAMPLE">
            <AlertBanner>When things reach the extreme, they alternate to the opposite.</AlertBanner>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="APPLICATION SYSTEM/400 EXAMPLE">
          The Application System 400 (AS/400) is a line of servers and network adapters from IBM that was designed to help businesses manage their data, applications, and systems infrastructure. This usage example is a tribute to the interfaces those servers had.
          <br />
          <br />
          <AS400 />
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="AVATARS">
          Avatars identify users or entities in the interface. It can display an image, initials, or an icon, offering a visual connection to the user. Avatars appear in headers, comments, profiles, and messages. They provide quick recognition and add a personal touch to the digital experience.
          <br />
          <br />
          <Card title="EXAMPLE">
            <Avatar src="https://pbs.twimg.com/profile_images/1934755236364865537/OxJve4Jp_400x400.jpg" href="https://internet.dev" target="_blank" />
            <Avatar src="https://pbs.twimg.com/profile_images/1925213285663805441/fUiKWlj2_400x400.jpg" href="https://internet.dev" target="_blank" />
            <Avatar src="https://pbs.twimg.com/profile_images/1890125319224598528/ZILr9OGp_400x400.jpg" href="https://internet.dev" target="_blank" />
            <Avatar src="https://pbs.twimg.com/profile_images/1748647089633169408/B7vd7ito_400x400.jpg" href="https://internet.dev" target="_blank" />
            <Avatar src="https://pbs.twimg.com/profile_images/1841883108305731585/3rhRm7aY_400x400.jpg" href="https://internet.dev" target="_blank" />
            <Avatar src="https://avatars.githubusercontent.com/u/10610892?v=4" href="https://internet.dev" target="_blank" />
            <br />
            <br />
            <Avatar src="https://pbs.twimg.com/profile_images/1934755236364865537/OxJve4Jp_400x400.jpg" href="https://x.com/aalimbuyuguen" target="_blank">
              <Indent>
                ANDREW ALIMBUYUGUEN
                <br />
                Webmaster
              </Indent>
            </Avatar>
            <Avatar src="https://pbs.twimg.com/profile_images/1748647089633169408/B7vd7ito_400x400.jpg" href="https://x.com/ana_piligrim" target="_blank">
              <Indent>
                ANASTASIYA URALEVA
                <br />
                Webmaster
              </Indent>
            </Avatar>
            <Avatar src="https://pbs.twimg.com/profile_images/1890125319224598528/ZILr9OGp_400x400.jpg" href="https://x.com/elijaharita" target="_blank">
              <Indent>
                ELIJAH SEED ARITA
                <br />
                Webmaster
              </Indent>
            </Avatar>
            <Avatar src="https://pbs.twimg.com/profile_images/1919579065444663300/cxCRW91y_400x400.jpg" href="https://x.com/caidanwilliams" target="_blank">
              <Indent>
                CAIDAN WILLIAMS
                <br />
                Webmaster
              </Indent>
            </Avatar>
            <Avatar src="https://pbs.twimg.com/profile_images/1885454100223188993/6HXdKp9n_400x400.jpg" href="https://x.com/binary_fiddler" target="_blank">
              <Indent>
                CHENYU HUANG
                <br />
                Webmaster
              </Indent>
            </Avatar>
            <Avatar src="https://pbs.twimg.com/profile_images/1925213285663805441/fUiKWlj2_400x400.jpg" href="https://x.com/wwwjim" target="_blank">
              <Indent>
                JIMMY LEE
                <br />
                Staff Janitor
              </Indent>
            </Avatar>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="BADGES">
          Badges communicate status, notification counts, or attribute labels. Typically circular or pill-shaped, they display a number or short text, often overlaid on an icon or element. Badges highlight updates, unread messages, or categorize items with status indicators. They provide critical information at a glance, improving navigation and user engagement.
          <br />
          <br />
          <Card title="EXAMPLE">
            <Badge>Example</Badge>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="BAR LOADER">
          A long loader is a visual element that signals ongoing activity or progress, reassuring users that a task is being processed. Commonly used during actions like data fetching or file uploads, it provides feedback to reduce uncertainty.
          <br />
          <br />
          <Card title="EXAMPLE">
            <BarLoader intervalRate={1000} />
            <BarLoader intervalRate={100} />
            <BarLoader progress={50} />
            <BarLoader progress={100} />
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="BLOCK LOADER">
          A block loader is a visual indicator that signals ongoing activity or progress while occupying only a single character of space. It reassures users that a task is being processed or that activity is occurring.
          <br />
          <br />
          <Card title="EXAMPLE">
            <BlockLoader mode={0} />
            <br />
            <BlockLoader mode={1} />
            <br />
            <BlockLoader mode={2} />
            <br />
            <BlockLoader mode={3} />
            <br />
            <BlockLoader mode={4} />
            <br />
            <BlockLoader mode={5} />
            <br />
            <BlockLoader mode={6} />
            <br />
            <BlockLoader mode={7} />
            <br />
            <BlockLoader mode={8} />
            <br />
            <BlockLoader mode={9} />
            <br />
            <BlockLoader mode={10} />
            <br />
            <BlockLoader mode={11} />
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="BLOG POST">
          A blog post can be composed of various components from our component repository. Typically, blog posts include breadcrumbs, an avatar, the author’s name, the publication date, and the blog post content.
          <br />
          <br />
          <CardDouble title="POST">
            <Breadcrumbs
              items={[
                {
                  name: `Christopher Alexander`,
                  url: 'https://www.youtube.com/watch?v=98LdFA-_zfA',
                },
                {
                  name: `The Nature of Order`,
                  url: 'http://www.natureoforder.com/overview.htm',
                },
                {
                  name: `Book 1: The Phenomenon of Life`,
                },
                {
                  name: `A World Picture`,
                },
              ]}
            />
            <br />
            <br />
            <Avatar src="https://upload.wikimedia.org/wikipedia/commons/0/0f/ChristopherAlexander2012_cropped.jpg" href="https://internet.dev" target="_blank">
              <Indent>
                CHRISTOPHER ALEXANDER
                <br />
                1-1-2002
              </Indent>
            </Avatar>
            <br />
            <Divider type="DOUBLE" />
            <br />
            <br />
            <br />
            <br />
            I believe that we have in us a residue of a world-picture which is essentially mechanical in nature – what we might call the mechanist-rationalist world picture ... Like an infection it has entered us, it affects our actions, it affects our morals, it affects our sense of beauty.
            <br />
            <br />
            This is a picture of a world made of atoms which whirl around in a mechanical fashion: a world in which it is assumed that all the universe is a blind mechanism, whirling on its way, under the impact of the ‘laws of nature.’ These laws are, essentially, those mechanistic laws which explain how the atoms and the structures made of these atoms proceed on their way ... Even though we would admit that the precise laws and mechanisms may not be known, we assume that underlying our ignorance there are some laws, not quite formulated, which do account for how things work ...
            <br />
            <br />
            I have reached the conclusion that the strange fantasies, the private in-house language about architecture, the strange nature of 20th-century gallery art, deconstructionism, postmodernism, modernism and a host of other ‘isms’, all of which affect our physical world hugely, are created because of an entanglement between the nature of architecture, the practice of architecture, and the mechanical conception of the universe.
            <br />
            <br />
            More precisely, I believe that the mistake and confusion in our picture of the the art of building has come from our conception of what matter is.
            <br />
            <br />
            The present conception of matter, and the opposing one which I shall try to put in its place, may both be summarized by the nature of order. Our idea of matter is essentially governed by our idea of order ... So it is the nature of order which lies at the root of the problem of architecture ...
            <br />
            <br />
            When we understand what order is, I believe we shall better understand what matter is and then what the universe itself is.
          </CardDouble>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="BREADCRUMBS">
          Breadcrumbs display the current page or context within a website or application. They show the hierarchy and navigation path, helping users understand their location. Breadcrumbs allow users to navigate back through levels or categories and are especially useful for deeply nested pages.
          <br />
          <br />
          <Card title="EXAMPLE">
            <Breadcrumbs
              items={[
                {
                  name: `Philosophical Taoism`,
                  url: 'https://en.wikipedia.org/wiki/Taoist_philosophy',
                },
                {
                  name: `Ursula K. Le Guin`,
                  url: 'https://en.wikipedia.org/wiki/Ursula_K._Le_Guin',
                },
                {
                  name: `The Lathe of Heaven`,
                  url: 'https://en.wikipedia.org/wiki/The_Lathe_of_Heaven',
                },
              ]}
            />
            <br />
            <br />
            <Breadcrumbs
              items={[
                {
                  name: `161 AD`,
                  url: 'https://en.wikipedia.org/wiki/161',
                },
                {
                  name: `Nerva–Antonine dynasty`,
                  url: 'https://en.wikipedia.org/wiki/Nerva–Antonine_dynasty',
                },
                {
                  name: `Marcus Aurelius Antoninus`,
                  url: 'https://en.wikipedia.org/wiki/Marcus_Aurelius',
                },
                {
                  name: `The Meditations`,
                  url: 'https://classics.mit.edu/Antoninus/meditations.html',
                },
              ]}
            />
            <br />
            <br />
            <Breadcrumbs
              items={[
                {
                  name: `Orthos Logos`,
                  url: 'https://orthoslogos.fr/',
                },
                {
                  name: `Littérature`,
                  url: 'https://orthoslogos.fr/litterature',
                },
                {
                  name: `Discours`,
                  url: 'https://orthoslogos.fr/litterature/discours/',
                },
                {
                  name: `Patrick Geddes`,
                  url: 'https://en.wikipedia.org/wiki/Patrick_Geddes',
                },
              ]}
            />
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="BUTTONS">
          Button components are essential interactive elements within SRCL, facilitating actions like navigation, form submission, and command execution.
          <br />
          <br />
          <Card title="EXAMPLE">
            <Button>Primary Button</Button>
            <br />
            <Button theme="SECONDARY">Secondary Button</Button>
            <br />
            <Button isDisabled>Disabled Button</Button>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="BUTTON GROUP">
          Button groups organize related actions within a shared container, offering quick access to frequently used tasks. These buttons are visually connected to emphasize their relationship and can also indicate a selected state.
          <br />
          <br />
          <Card title="EXAMPLE">
            <ButtonGroup items={[{ body: '16 PX', selected: true }, { body: '32 PX' }, { body: '42 PX' }]} />
            <ButtonGroup isFull items={[{ body: '16 PX', selected: true }, { body: '32 PX' }, { body: '42 PX' }]} />
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="CARDS">
          Cards are MS-DOS–inspired sections designed to group related content and actions. They can serve as standalone features or function as part of a larger application. Each card clearly outlines key information, making it easier for users to identify and interact with important details.
          <br />
          <br />
          <Card title="Left-A" mode="left">
            <Card title="Right-B" mode="right">
              <Card title="C">To seek the timeless way we must first know the quality without a name. There is a central quality which is the root criterion of life and spirit in a man, a town, a building, or a wilderness. This quality is objective and precise, but it cannot be named.</Card>
            </Card>
          </Card>
          <br />
          <CardDouble title="Left-A" mode="left">
            <CardDouble title="Right-B" mode="right">
              <CardDouble title="C">The structure of life I have described in buildings - the structure which I believe to be objective - is deeply and inextricably connected with the human person, and with the innermost nature of human feeling.</CardDouble>
            </CardDouble>
          </CardDouble>
          <br />
          <Card title="Left-A" mode="left">
            <CardDouble title="Right-B" mode="right">
              <Card title="C">We are searching for some kind of harmony between two intangibles: a form which we have not yet designed and a context which we cannot properly describe.</Card>
            </CardDouble>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="CHECKBOX">
          Checkboxes represent a binary choice, letting users toggle options on or off. Each Checkbox operates independently, allowing multiple selections without affecting others. Checkboxes are ideal for forms, surveys, or scenarios requiring multi-selection, providing a simple way for user input.
          <br />
          <br />
          <Card title="EXAMPLE">
            <Checkbox name="1">The past, though a tutor, is not a thing to lament, but a wellspring of wisdom from which we draw without regret.</Checkbox>
            <Checkbox name="2">A measure of obsession doth sharpen the will, for the long path, though beset with trials, leadeth ever toward glories.</Checkbox>
            <Checkbox name="3">Kindness and gratitude must light our way in all dealings, regardless of circumstance.</Checkbox>
            <Checkbox name="4">Stand firm beside thy fellow for shared triumph is the sweetest of all.</Checkbox>
            <Checkbox name="5">Let us strive that design be not a mere ornament to the world, but a worthy service to humanity itself.</Checkbox>
            <Checkbox name="6">Artifacts built with care do grant webmasters the power to shape their own fates, and to serve those thou dost cherish is an honor beyond measure.</Checkbox>
            <Checkbox name="7">Intensity, as fire contained, burneth most brightly when turned toward aims; thus, let us spurn the call of mediocrity and cast aside the seductions of decay.</Checkbox>
            <Checkbox name="8">Mistakes are not curses, but treasures wrapped in adversity, offered to those wise enough to seize their lessons.</Checkbox>
            <Checkbox name="9">Expect naught, but receive all with gratitude, and find a place of trust wherein thou mayest dwell for a time.</Checkbox>
            <Checkbox name="10">From thy master learn what thou canst, and from all others likewise, for wisdom hath many guises.</Checkbox>
            <Checkbox name="11">To follow with discipline is good; to follow oneself with discipline is better.</Checkbox>
            <Checkbox name="12">Work with fervor and take joy where it may be found, for the making is as sweet as the outcome.</Checkbox>
            <Checkbox name="13">Be mindful that there are ever more ways than two, and seek not merely to follow the trade but to alter its course, bringing value wherever it is given thee to do so.</Checkbox>
            <Checkbox name="14">Whether rewarded or not, let us ply our craft for the love of it, for therein lies mastery.</Checkbox>
            <Checkbox name="15">Assume nothing, and let no person escape thy regard.</Checkbox>
            <Checkbox name="16">A fine process doth honor the task, but let the result be no less fine.</Checkbox>
            <Checkbox name="17">Keep faith with those who make promises, and shouldst thou be called to push others, push thyself the harder.</Checkbox>
            <Checkbox name="18">Thy health is thy treasure, and building a company shall be no graceful dance, but a contest of strife.</Checkbox>
            <Checkbox name="19">Take always the first step, for even in failure doth wisdom grow.</Checkbox>
            <Checkbox name="20">Seek ever to broaden thy knowledge of art, software, music, letters, and all things ancient and new, for these are the treasures of the mind.</Checkbox>
            <Checkbox name="21">Thy fate lieth ever in thine own hands, and the soul readeth not only the landscape, but the heart that beats beneath it.</Checkbox>
            <Checkbox name="22">Let thy voice be thine own, unborrowed and unbowed, and make it heard without fear.</Checkbox>
            <Checkbox name="23">Rejoice in the victories of thy fellow webmasters, for in bearing witness to their triumphs is joy in its truest form.</Checkbox>
            <Checkbox name="24">Grow accustomed to the weight of pressure, for in such a forge is the finest steel tempered.</Checkbox>
            <Checkbox name="25">Thus do we press onward—undaunted and unyielding—in pursuit of a better physical and digital world.</Checkbox>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="CHESSBOARD">
          A minimal 8×8 component that maps alphanumeric piece identifiers to Unicode chess symbols, uses alternating squares, and includes labeled rows and columns. Simply provide an 8×8 array of piece codes or empty strings for blank squares. Perfect for rendering classic chess scenes.
          <br />
          <br />
          <Card title="DEFAULT">
            <Chessboard board={Constants.CHESSBOARD_DEFAULT_POSITIONS} />
          </Card>
          <br />
          <Accordion defaultValue={true} title="BAD BISHOP">
            The “Bad Bishop” describes a bishop locked on squares of its own color by its own pawns, stifling its mobility. In this example from chess.com, Black’s bishop on B-7 is hindered by its own pawns and cannot be freed easily. Coincidentally, Bad Bishop is also one of the best Seattle bars (704 1st Ave), it is known for its creative cocktails and lively atmosphere.
            <br />
            <br />
            <Card title="BAD BISHOP">
              <Chessboard board={Constants.CHESSBOARD_BAD_BISHOP} />
            </Card>
            <br />
          </Accordion>
          <Accordion defaultValue={true} title="CHECKMATE">
            In chess, the en passant rule allows a pawn to capture an enemy pawn that has just made a two-square advance, moving to the square it bypassed as if it had only advanced one square. This unique rule prevents a pawn from escaping capture by skipping past an opponent. In the scenario below, White uses en passant to deliver checkmate, leaving Black’s king with no legal moves.
            <br />
            <br />
            <Card title="EN PASSANT">
              <Row style={{ whiteSpace: 'nowrap' }}>
                <Chessboard board={Constants.CHESSBOARD_CHECKMATE_STEP_ONE} />
                &nbsp;
                <Chessboard board={Constants.CHESSBOARD_CHECKMATE_STEP_TWO} />
                &nbsp;
                <Chessboard board={Constants.CHESSBOARD_CHECKMATE_STEP_THREE} />
              </Row>
            </Card>
          </Accordion>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="CODE BLOCKS">
          Code blocks display code examples clearly and concisely, making them easy to read, copy, and use. This version has line numbers that are not user selectable.
          <br />
          <br />
          <Card title="CODE">
            <CodeBlock>
              {`#include <iostream>
#include <string>
#include <thread>
#include <asio.hpp>

using asio::ip::tcp;

void handle_client(tcp::socket socket) {
    try {
        std::string message = 
            "HTTP/1.1 200 OK\\r\\n"
            "Content-Type: text/plain\\r\\n"
            "Connection: close\\r\\n"
            "\\r\\n"
            "Hello, World!";
        asio::write(socket, asio::buffer(message));
    } catch (...) {}
}

int main() {
    asio::io_context context;

    tcp::acceptor acceptor(context, 
        tcp::endpoint(tcp::v4(), 8080));

    std::cout << "Server running on port 8080...\\n";
              
    while (true) {
        tcp::socket socket(context);
        acceptor.accept(socket);
        std::thread(handle_client, std::move(socket)).detach();
    }

    return 0;
}`}
            </CodeBlock>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="COMBOBOX">
          Comboboxes combine a list with an editable textbox, allowing users to select from a list or input data manually. It offers flexibility and autocomplete features, improving usability in scenarios where users may not know all options.
          <br />
          <br />
          <Card title="COMBOBOX">
            <ComboBox data={Constants.LANDSCAPES} label="SEARCH THE WORLD" />
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="DATA TABLE">
          Data tables are for organizing large datasets into rows and columns for clear visibility and easy interpretation. It is used in scenarios like reporting systems, dashboards, and list views where data needs comparison, analysis, or manipulation. Features like sorting, filtering, pagination, and inline editing make data handling more efficient. The entire table width is limited to 64ch to fit the grid precisely.
          <br />
          <br />
          <Card title="STATIC">
            <DataTable data={Constants.SAMPLE_TABLE_DATA_CHANGE_ME} />
          </Card>
          <Card title="UPDATING">
            <UpdatingDataTable data={Constants.SAMPLE_TABLE_DATA_CHANGE_ME} />
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="DATE PICKER">
          A date picker is a UI control for selecting dates, and sometimes time, through a visual calendar interface inspired by MS-DOS. It ensures accurate date input and avoids formatting errors. Commonly used in forms, scheduling, or date-related tasks.
          <br />
          <br />
          <Card title="EXAMPLE">
            <DatePicker year={2012} month={12} />
            <br />
            <br />
            <DatePicker year={2024} month={12} />
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="DASHBOARD RADAR EXAMPLE">
          The Dashboard Radar Example is a visual homage to Brian Wyvill, the creator of the iconic Nostromo interface in Alien 1979. This example using SRCL components recreates the orbital simulations that brought a sense of realism to the movie’s early scenes.
          <br />
          <br /> The original AOS (Alien Orbit Simulator) was inspired by the moment when the Nostromo’s crew awakens to decipher a distress signal, this adapation depicts the kind of graphical representation that could chart complex trajectories around distant planets.
          <br />
          <br />
          <Card>
            <Row style={{ whiteSpace: 'nowrap', minWidth: '70ch' }}>
              <DashboardRadar />
            </Row>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="DENABASE EXAMPLE">
          The Denabase component is a tribute to the work of Territory Studio in the movie Blade Runner 2049. It draws inspiration from a DNA database containing an archive of individual DNA cards. They explored various card systems to capture a sense of physicality.
          <br />
          <br />
          <Denabase />
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="DIALOG">
          Dialog components overlay the main content—reminiscent of early graphical interfaces—to capture a user’s focus for tasks requiring input, a choice, or confirmation without leaving the current context.
          <br />
          <br />
          <Card title="EXAMPLE">
            <br />
            <br />
            <Dialog title="FAREWELL">
              There are unsaved changes.
              <br />
              Are you sure you want to start the new year?
            </Dialog>
            <br />
            <br />
            <Dialog title="GOODBYE">
              The 2024 session is nearly out of time.
              <br />
              Save progress and load 2025?
            </Dialog>
            <br />
            <br />
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="DIVIDER">
          A divider separates sections of content, creating clear distinctions between related groups. It is typically a line or space, oriented horizontally or vertically based on the layout. Divider helps organize information, improve readability, and enhance the interface’s clarity and structure.
          <br />
          <br />
          <CardDouble title="ENTROPY">
            Any sense of order or stability inevitably crumbles. The entire universe follows a dismal trek toward a dull state of ultimate turmoil.
            <br />
            <br />
            <Divider />
            <br />
            To keep track of this cosmic decay, physicists employ a concept called entropy. Entropy is a measure of disorderliness, and the declaration that entropy is always on the rise — known as the second law of thermodynamics — is among nature’s most inescapable commandments.
            <br />
            <br />
            <Divider type="DOUBLE" />
            <br />
            I have long felt haunted by the universal tendency toward messiness. Order is fragile. It takes months of careful planning and artistry to craft a vase but an instant to demolish it with a soccer ball. We spend our lives struggling to make sense of a chaotic and unpredictable world, where any attempt to establish control seems only to backfire.
            <br />
            <br />
            <Divider type="GRADIENT" />
            <br />
            The second law demands that machines can never be perfectly efficient, which implies that whenever structure arises in the universe, it ultimately serves only to dissipate energy further — be it a star that eventually explodes or a living organism converting food into heat. We are, despite our best intentions, agents of entropy.
            <br />
            <br />
            <Divider type="GRADIENT" />
            <br />
            “Nothing in life is certain except death, taxes and the second law of thermodynamics,” wrote Seth Lloyd, a physicist at the Massachusetts Institute of Technology. There’s no sidestepping this directive. The growth of entropy is deeply entwined with our most basic experiences, accounting for why time runs forward and why the world appears deterministic rather than quantum mechanically uncertain.
            <br />
            <br />
            <Divider type="GRADIENT" />
            <br />— Zack Savitzky
          </CardDouble>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="DRAWER">
          A drawer is a panel that slides in from the screen edge, providing space for secondary content, actions, or navigation links while keeping the main content uninterrupted.
          <br />
          <br />
          <CardDouble title="INTRO(1)">
            <RowSpaceBetween>
              <Drawer>
                <ActionListItem icon={`⊹`}>User Commands</ActionListItem>
                <ActionListItem icon={`⊹`}>System Calls</ActionListItem>
                <ActionListItem icon={`⊹`}>C Library Functions</ActionListItem>
                <ActionListItem icon={`⊹`}>Devices and Special Files</ActionListItem>
                <ActionListItem icon={`⊹`}>File Formats and Conventions</ActionListItem>
                <ActionListItem icon={`⊹`}>Games et. Al.</ActionListItem>
                <ActionListItem icon={`⊹`}>Miscellanea</ActionListItem>
                <ActionListItem icon={`⊹`}>System Administration</ActionListItem>
                <ActionListItem icon={`⊹`}>Tools</ActionListItem>
                <ActionListItem icon={`⊹`}>Daemons</ActionListItem>
              </Drawer>
              <ContentFluid>
                INTRODUCTION
                <br />
                <br />
                Section 1 of the manual describes user commands and tools, for example, file manipulation tools, shells, compilers, web browsers, file and image viewers and editors, and so on. All commands yield a status value on termination. This value can be tested (e.g., in most shells the variable $? contains the status of the last executed command) to see whether the command completed successfully. A zero exit status is conventionally used to indicate success, and a nonzero status means that the command was unsuccessful. (Details of the exit status can be found in wait(2).) A nonzero exit status can be in the range 1 to 255, and some commands use different nonzero status values to indicate the reason why the command failed.
              </ContentFluid>
            </RowSpaceBetween>
          </CardDouble>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="DROPDOWN MENU">
          A dropdown menu is an interactive element that lets users select an option from a collapsible menu, saving space by hiding options until needed.
          <br />
          <br />
          <Card title="EXAMPLE">
            <RowSpaceBetween>
              <DropdownMenuTrigger
                items={[
                  { icon: '⊹', children: 'F1 - Help' },
                  { icon: '⊹', children: 'F2 - Custom Help' },
                  { icon: '⊹', children: 'F3 - Directory' },
                  { icon: '⊹', children: 'F4 - Locate File' },
                  { icon: '⊹', children: 'F5 - Change Drive' },
                  { icon: '⊹', children: 'F6 - Change Directory' },
                  { icon: '⊹', children: `F7 - DOS Command` },
                  { icon: '⊹', children: 'F8 - Set Time/Date' },
                  { icon: '⊹', children: 'F9 - Disk Space' },
                  { icon: '⊹', children: 'F10 - Copy Files' },
                ]}
              >
                <ActionButton>TOP LEFT</ActionButton>
              </DropdownMenuTrigger>
              <DropdownMenuTrigger
                items={[
                  { icon: '⭡', children: 'Restore from Time Machine' },
                  { icon: '⭢', children: 'Reinstall macOS Ventura' },
                  { icon: '⭣', children: 'Safari' },
                  { icon: '⭠', children: 'Disk Utility' },
                  { icon: '⊹', children: 'Visit Search System', href: 'https://searchsystem.co/', target: '_blank' },
                ]}
              >
                <ActionButton>TOP RIGHT</ActionButton>
              </DropdownMenuTrigger>
            </RowSpaceBetween>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <RowSpaceBetween>
              <DropdownMenuTrigger
                items={[
                  { icon: '⊹', children: 'Safe mode' },
                  { icon: '⊹', children: 'Safe mode with Networking' },
                  { icon: '⊹', children: 'Safe Mode with Command Prompt' },
                  { icon: '⊹', children: 'Enable Boot Logging' },
                  { icon: '⊹', children: 'Enable low-resolution video (640x480)' },
                  { icon: '⊹', children: 'Last Known Good Configuration (advanced)' },
                  { icon: '⊹', children: `Direcotry Services Restore Node` },
                  { icon: '⊹', children: 'Debugging Mode' },
                  { icon: '⊹', children: 'Disable automatic restart on system failure' },
                  { icon: '⊹', children: 'Disable Driver Signature Enforcement' },
                ]}
              >
                <ActionButton>BOTTOM LEFT</ActionButton>
              </DropdownMenuTrigger>
              <DropdownMenuTrigger
                items={[
                  { icon: '⊹', children: 'Create New Menu' },
                  { icon: '⊹', children: 'Edit a Menu' },
                  { icon: '⊹', children: 'Remove A Menu' },
                  { icon: '⊹', children: 'DOS Password' },
                  { icon: '⊹', children: 'Screen Saver' },
                  { icon: '⊹', children: 'Company Name' },
                  { icon: '⊹', children: `Set Swap Drive` },
                  { icon: '⊹', children: 'Select Colors' },
                  { icon: '⊹', children: 'Sound On/Off' },
                  { icon: '⊹', children: 'Save all Menus' },
                  { icon: '⊹', children: 'Leave Setup' },
                ]}
              >
                <ActionButton>BOTTOM RIGHT</ActionButton>
              </DropdownMenuTrigger>
            </RowSpaceBetween>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="EMPTY STATE">
          An empty state informs users when no content is available, such as for first-time users, empty searches, or errors.
          <br />
          <br />
          <Card title="EXAMPLE">
            <Grid>WORK IN PROGRESS</Grid>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="INPUT">
          An input field is a fundamental UI component that allows users to enter and edit text or numerical data. It is commonly used in forms, search bars, and other interfaces requiring user input.
          <br />
          <br />
          <Card title="EXAMPLE">
            <Input label="MULTIPLE INPUTS" autoComplete="off" isBlink={false} name="input_test_empty" />
            <Input autoComplete="off" isBlink={false} name="input_test_empty" />
            <Input autoComplete="off" isBlink={false} name="input_test_empty" />
            <Input autoComplete="off" isBlink={false} label="EMPTY CASE" name="input_test_one" />
            <Input autoComplete="off" isBlink={false} placeholder="All the world is a stage" label="PLACEHOLDER" name="input_test_two" />
            <Input autoComplete="off" isBlink={false} label="PASSWORD" type="password" name="input_test_password" />
            <Input autoComplete="off" isBlink={true} label="CARET BLINK" name="input_test_blink" />
            <Input autoComplete="off" caretChars="(✿﹏●)" isBlink={true} label="CUSTOM CARET TEXT" name="input_test_caret" />
            <Input autoComplete="off" caretChars="⌫ ERROR" isBlink={false} label="CUSTOM CARET TEXT" name="input_test_single_caret" />
            <Input autoComplete="off" caretChars={<BlockLoader mode={6} />} isBlink={false} label="CUSTOM CARET LOADER" name="input_test_single_caret" />
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="FORM">
          A form is a key interface element for collecting user inputs.
          <br />
          <br />
          <CardDouble title="NEW ACCOUNT">
            Create a new MakeBelieve™ account, where anything is possible at your command line in the browser.
            <br />
            <br />
            <RadioButtonGroup
              defaultValue="test_individual"
              options={[
                { value: 'test_individual', label: 'I’m using this for personal use.' },
                { value: 'test_developer', label: 'I’m building or creating something for work.' },
                { value: 'test_company', label: 'We’re using this as a team or organization.' },
              ]}
            />
            <br />
            <Input autoComplete="off" label="USERNAME" placeholder="Choose a username (e.g., SurfGirl29)" name="test_username" />
            <Input autoComplete="off" label="PASSWORD" placeholder="Create a password (8+ characters)" type="password" name="test_password" />
            <Input autoComplete="off" label="CONFIRM" placeholder="Type it again" type="password" name="test_confirm" />
            <br />
            <Checkbox name="test_terms">I agree to the Terms of Service, Data Privacy Policy, and Acceptable Use Guidelines.</Checkbox>
            <Checkbox name="test_goodwill">I agree not to use this service for unlawful purposes.</Checkbox>
            <br />
            <Button>Create an account</Button>
          </CardDouble>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="LINK">
          Links are interactive elements that enable navigation within an application or to external resources, typically styled with underlining or distinct colors to indicate clickability.
          <br />
          <br />
          <Card title="EXAMPLE">
            <ol>
              <ListItem>
                <a href="https://www.tumblr.com/tagged/hiroo%20isono" target="_blank">
                  Hirō Isono
                </a>
              </ListItem>
              <ListItem>
                <a href="https://www.tumblr.com/tagged/rebecca%20guay" target="_blank">
                  Rebecca Guay
                </a>
              </ListItem>
              <ListItem>
                <a href="https://www.tumblr.com/tagged/terese%20nielsen" target="_blank">
                  Terese Nielsen
                </a>
              </ListItem>
              <ListItem>
                <a href="https://www.tumblr.com/tagged/pablo%20uchida" target="_blank">
                  Pablo Uchida
                </a>
              </ListItem>
              <ListItem>
                <a href="https://www.tumblr.com/tagged/claude%20monet" target="_blank">
                  Oscar-Claude Monet
                </a>
              </ListItem>
              <ol>
                <ListItem>
                  <a href="https://en.wikipedia.org/wiki/Impressionism" target="_blank">
                    Impressionism
                  </a>
                </ListItem>
                <ListItem>
                  <a href="https://en.wikipedia.org/wiki/Modernism" target="_blank">
                    Modernism
                  </a>
                </ListItem>
                <ListItem>
                  <a href="https://en.wikipedia.org/wiki/En_plein_air" target="_blank">
                    Painting Outdoors
                  </a>
                </ListItem>
              </ol>
            </ol>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="LIST">
          Lists are flexible interface elements used to display a series of items in an organized way. They are often used to present data, menu options, or search results and can be ordered or unordered, with interactive elements like checkboxes or buttons.
          <br />
          <br />
          <Card title="EXAMPLE">
            <ol>
              <ListItem>Year of the Four Emperors</ListItem>
              <ListItem>Flavian dynasty</ListItem>
              <ListItem>Nerva–Antonine dynasty</ListItem>
              <ol>
                <ListItem>Marcus Cocceius Nerva</ListItem>
                <ListItem>Marcus Ulpius Traianus</ListItem>
                <ListItem>Publius Aelius Hadrianus</ListItem>
                <ListItem>Titus Aelius Hadrianus Antoninus Pius</ListItem>
                <ListItem>Marcus Aurelius Antoninus</ListItem>
                <ol>
                  <ListItem>Hellenistic philosophy</ListItem>
                  <ListItem>Western philosophy</ListItem>
                  <ListItem>Stoicism</ListItem>
                </ol>
              </ol>
              <ListItem>Year of the Five Emperors</ListItem>
            </ol>
            <br />
            <ul>
              <ListItem>Book of Changes (The I Ching)</ListItem>
              <ListItem>The Analects</ListItem>
              <ListItem>Taoism</ListItem>
              <ListItem>Thirty-Six Stratagems</ListItem>
              <ul>
                <ListItem>Deceive the heavens to cross the sea</ListItem>
                <ListItem>Make a sound in the east, then strike in the west</ListItem>
                <ListItem>Create something from nothing</ListItem>
              </ul>
              <ListItem>The Art of War</ListItem>
              <ListItem>Wuzi</ListItem>
              <ListItem>Six Secret Teachings</ListItem>
            </ul>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="MESSAGES">
          Messages in this library present a modern messaging experience through an MS-DOS–inspired aesthetic. Instead of rounded speech bubbles, messages appear in simple rectangular boxes, evoking a nostalgic, classic PC feel.
          <br />
          <br />
          <Card title="EXAMPLE">
            <Message>You create the world of the dream, you bring the subject into that dream, and they fill it with their subconscious.</Message>
            <MessageViewer>How could I ever acquire enough detail to make them think that its reality?</MessageViewer>
            <Message>Well dreams, they feel real while we're in them, right? It's only when we wake up that we realize how things are actually strange.</Message>
            <Message>Let me ask you a question, you, you never really remember the beginning of a dream do you? You always wind up right in the middle of what's going on.</Message>
            <MessageViewer>I guess, yeah.</MessageViewer>
            <Message>So how did we end up here?</Message>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="MESSAGES INTERFACE">
          This example combines the aesthetics of iMessage and IRSSI with a terminal-inspired design. It shows how easy it is to embed a simple web application into your website.
          <br />
          <br />
          <Card title="MESSAGES">
            <MessagesInterface />
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="MODAL">
          Modals are dialog boxes or popups that overlay the main content, requiring user interaction. They are used to capture inputs, display information, or focus on specific tasks without leaving the current context, often accompanied by an overlay to maintain focus
          <br />
          <br />
          <Card title="EXAMPLE">
            <ModalTrigger
              modal={ModalCanvasSnake}
              modalProps={{
                buttonText: 'GAME OVER',
              }}
            >
              <ActionButton>Render Canvas Snake</ActionButton>
            </ModalTrigger>

            <ModalTrigger
              modal={ModalDOMSnake}
              modalProps={{
                buttonText: 'GAME OVER',
              }}
            >
              <ActionButton>Render DOM Snake</ActionButton>
            </ModalTrigger>

            <ModalTrigger
              modal={ModalCanvasPlatformer}
              modalProps={{
                buttonText: 'GAME OVER',
              }}
            >
              <ActionButton>Render Canvas Platformer</ActionButton>
            </ModalTrigger>

            <ModalTrigger
              modal={ModalMatrixModes}
              modalProps={{
                buttonText: 'CLOSE',
              }}
            >
              <ActionButton>Render Modal Matrix Modes</ActionButton>
            </ModalTrigger>

            <ModalTrigger
              modal={ModalChess}
              modalProps={{
                board: [
                  ['r', '', '', 'q', '', 'b', '', 'r'],
                  ['p', 'p', 'p', 'b', 'k', ' ', ' ', 'p'],
                  ['', '', '', 'p', '', '', 'B', ''],
                  ['', '', '', 'P', 'p', '', 'B', ''],
                  ['', '', 'P', '', '', '', '', ''],
                  ['', '', '', '', '', '', '', 'P'],
                  ['P', 'P', ' ', ' ', ' ', 'P', 'P', ''],
                  ['R', ' ', ' ', ' ', 'K', '', '', 'R'],
                ],
                buttonText: 'CONCEDE',
                title: `CHECKMATE`,
              }}
            >
              <ActionButton>Render Modal Checkmate</ActionButton>
            </ModalTrigger>

            <ModalTrigger
              modal={ModalAlert}
              modalProps={{
                message: 'During the 1960s, Ritchie and Ken Thompson worked on the Multics operating system at Bell Labs. Thompson then found an old PDP-7 machine and developed his own application programs and operating system from scratch, aided by Ritchie and others. In 1970, Brian Kernighan suggested the name "Unix", a pun on the name "Multics". To supplement assembly language with a system-level programming language, Thompson created B. Later, B was replaced by C, created by Ritchie, who continued to contribute to the development of Unix and C for many years.',
                buttonText: 'Sweet, thanks.',
              }}
            >
              <ActionButton>Render Alert Modal A</ActionButton>
            </ModalTrigger>
            <ModalTrigger modal={ModalAlert} modalProps={{ message: `Dennis Ritchie and Ken Thompson's creation of the UNIX operating system and the C programming language were pivotal developments in the progress of computer science. Today, 50 years after its beginnings, UNIX and UNIX-like systems continue to run machinery from supercomputers to smartphones.` }}>
              <ActionButton>Render Alert Modal B</ActionButton>
            </ModalTrigger>

            <ModalTrigger modal={ModalAlert} modalProps={{ message: `In short, no pattern is an isolated entity. Each pattern can exist in the world only to the extent that is supported by other patterns: the larger patterns in which it is embedded, the patterns of the same size that surround it, and the smaller patterns which are embedded in it.` }}>
              <ActionButton>Render Alert Modal C</ActionButton>
            </ModalTrigger>

            <ModalTrigger modal={ModalCreateAccount}>
              <ActionButton>Render Create Account Modal</ActionButton>
            </ModalTrigger>

            <ModalTrigger modal={ModalError} modalProps={{ message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>, title: `SETUP` }}>
              <ActionButton>Error A</ActionButton>
            </ModalTrigger>

            <ModalTrigger
              modal={ModalError}
              modalProps={{
                message: (
                  <>
                    Boot Manager has experienced a problem.
                    <br />
                    <br />
                    Status: 0xc000000f
                    <br />
                    <br />
                    Info: An error occured transferring excecution.
                    <br />
                    <br />
                    You can try to recover the system with the Recovery Tools.
                    <br />
                    <br />
                    If the problem continues, please contact your system administrator or computer manufacturer.
                  </>
                ),
                title: `BOOT DRIVER`,
              }}
            >
              <ActionButton>Error B</ActionButton>
            </ModalTrigger>

            <ModalTrigger
              modal={ModalError}
              modalProps={{
                message: (
                  <>
                    Although you can't use CTRL+ALT+DEL to quit an application that has stopped responding in this context, there is no reason to in this state.
                    <br />
                    <br />
                    To quit this website, follow the options below or kill your browser, or choose to give up and go do something else.
                  </>
                ),
                title: `SACRED`,
              }}
            >
              <ActionButton>Error C</ActionButton>
            </ModalTrigger>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="NAVIGATION BAR">
          Navigation bars enable smooth transitions between top-level destinations in an app, using icons and text labels to represent sections.
          <br />
          <br />
          <Card title="EXAMPLE">
            <Navigation
              logo="✶"
              left={
                <ModalTrigger modal={ModalError} modalProps={{ message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>, title: `SETUP` }}>
                  <ActionButton>NAVIGATION ITEM A</ActionButton>
                </ModalTrigger>
              }
              right={
                <>
                  <ModalTrigger modal={ModalCreateAccount}>
                    <ActionButton>SIGN IN</ActionButton>
                  </ModalTrigger>
                </>
              }
            >
              <ModalTrigger
                modal={ModalError}
                modalProps={{
                  message: (
                    <>
                      Boot Manager has experienced a problem.
                      <br />
                      <br />
                      Status: 0xc000000f
                      <br />
                      <br />
                      Info: An error occured transferring excecution.
                      <br />
                      <br />
                      You can try to recover the system with the Recovery Tools.
                      <br />
                      <br />
                      If the problem continues, please contact your system administrator or computer manufacturer.
                    </>
                  ),
                  title: `BOOT DRIVER`,
                }}
              >
                <ActionButton>NAVIGATION ITEM B</ActionButton>
              </ModalTrigger>
            </Navigation>
            <Accordion defaultValue={true} title="KENYA HARA, WHITE">
              Colors do not exist separately and independently within nature; they are constantly shifting in response to subtle gradations of light. It is language that, magnificently, gives them clear shape.
            </Accordion>
            <Accordion defaultValue={true} title="KENYA HARA, WHITE">
              White can be attained by blending all the colors of the spectrum together, or through the substraction of ink and all other pigments. In short, it is "all colors" and "no color" at the same time.
            </Accordion>
            <Accordion defaultValue={true} title="KENYA HARA, WHITE">
              It is easy to think that beauty resides in the realm of creativity. Yet beauty hardly "appears" from nowhere. Recently, I have come to believe that we "discover" it through the cleaning and polishing we do to preserve things as they are. [...] The beauty of a temple garden rests not in the splendid features that were created by a talented designer; rather, its beauty is uncovered through the continual process of cleaning.
            </Accordion>
            <Accordion defaultValue={true} title="KENYA HARA, DESIGNING DESIGN">
              I used to believe that design was information architecture, and also that this architecture was built in the brain of an information recipient. Recently I've come to think that, although the materials of that architecture's construction are indeed the information brought from the outside by the sensory organs, at the same time some very important building blocks are also the recollected experiences, the memories, awakened by these external stimuli. People imagine the world and interpret it when outside stimuli awaken the mountain of their internally stored memories.
            </Accordion>
            <Accordion defaultValue={true} title="KENYA HARA, DESIGNING DESIGN">
              The human brain likes anything that entails a great amount of information. Its excessive capacity waits eagerly to perceive the world by completely exhausting its great receptive powers. That potential power, though, remains today in a state of extreme constriction and is a source of the information stress we're all under.
            </Accordion>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="POPOVER">
          Popovers are transient views that appear above content when users interact with an associated element, offering relevant information, details, or interactive content like actions or form elements.
          <br />
          <br />
          <Card title="EXAMPLE">
            <RowSpaceBetween>
              <HoverComponentTrigger component="popover" text="An old silent pond">
                <ActionButton>TOP LEFT</ActionButton>
              </HoverComponentTrigger>
              <HoverComponentTrigger component="popover" text="A world of dew">
                <ActionButton>TOP RIGHT</ActionButton>
              </HoverComponentTrigger>
            </RowSpaceBetween>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <RowSpaceBetween>
              <HoverComponentTrigger component="popover" text="The light of a candle">
                <ActionButton>BOTTOM LEFT</ActionButton>
              </HoverComponentTrigger>
              <HoverComponentTrigger component="popover" text="I write, erase, rewrite">
                <ActionButton>BOTTOM RIGHT</ActionButton>
              </HoverComponentTrigger>
            </RowSpaceBetween>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="PROGRESS BARS">
          Progress bars are visual indicators that display the completion status of tasks or processes. Ours allow for custom fill characters.
          <br />
          <br />
          <Card title="EXAMPLE">
            <Card mode="left" title="0%">
              <BarProgress progress={0} />
            </Card>

            <Card mode="left" title="25%">
              <BarProgress progress={25} />
            </Card>

            <Card mode="left" title="50%">
              <BarProgress progress={50} />
            </Card>

            <Card mode="left" title="75%">
              <BarProgress progress={75} fillChar={`(✿﹏●)`} />
            </Card>

            <Card mode="left" title="75%">
              <BarProgress progress={75} />
            </Card>

            <Card mode="left" title="100%">
              <BarProgress progress={100} />
            </Card>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="RADIO BUTTONS">
          Radio buttons are visual controls that let users make a single selection from a predefined set of mutually exclusive options. Represented as small circles that fill when selected, they are used when all options need to be visible and only one can be chosen.
          <br />
          <br />
          <CardDouble title="METHOD">
            You’re at the very beginning of designing your operating system. How do you choose to start?
            <br />
            <br />
            <RadioButtonGroup
              defaultValue="one"
              options={[
                { value: 'one', label: 'Custom Linux Kernel Derivative: Start with a minimal Linux kernel (e.g., a stripped-down mainline LTS release), integrate essential device drivers, and build out a tailored init process.' },
                { value: 'two', label: 'AOSP Base: Leverage an AOSP-derived HAL and system services, using BSP integration and existing frameworks as a foundation for rapid device bring-up.' },
                { value: 'three', label: 'Microkernel Approach: Implement a microkernel (e.g., seL4) to strictly separate core services, relying on IPC mechanisms and user-space servers to manage drivers, file systems, and device I/O.' },
              ]}
            />
          </CardDouble>
          <CardDouble title="INTERFACE">
            How will you implement your interface layer?
            <br />
            <br />
            <RadioButtonGroup
              defaultValue="four"
              options={[
                { value: 'four', label: 'Native GUI Shell + EGL/Wayland: Use a lean, native toolkit with hardware-accelerated rendering (EGL), compositing via Wayland, and minimal shell protocols.' },
                { value: 'five', label: 'Adapted Android Framework: Employ the Android UI stack (SurfaceFlinger, View hierarchy), integrating Material Components as baseline UI elements, and build custom system apps via Jetpack.' },
                { value: 'six', label: 'Custom-Compositor + Custom Widgets: Implement a dedicated compositor (e.g., custom Weston derivative) and write your own widget toolkit in C++/Rust, managing input events and layouts directly.' },
              ]}
            />
          </CardDouble>
          <CardDouble title="SECURITY">
            How will you handle security and lifecycle management?
            <br />
            <br />
            <RadioButtonGroup
              defaultValue="seven"
              options={[
                { value: 'seven', label: 'Signed Kernel/OS Updates + Verified Boot: Use a secure bootloader chain (e.g., U-Boot with verified boot), sign OTA payloads, and apply delta updates with rollback support.' },
                { value: 'eight', label: 'TEE Integration + SELinux Policies: Embed a Trusted Execution Environment (e.g., ARM TrustZone), enforce SELinux policies system-wide, and apply monthly patch-level updates from upstream code sources.' },
                { value: 'nine', label: 'Containerized Services + Granular Permissions: Run system services and third-party apps in containerized sandboxes (LXC, cgroups, seccomp), enforce capability-based permissions, and manage rolling updates at a container or microservice level.' },
              ]}
            />
          </CardDouble>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="SELECT">
          Select components are user interface controls that let users choose an option from a dropdown list. They display a list of options and collapse to show the selected choice, making them ideal for scenarios with limited space and multiple options.
          <br />
          <br />
          <Card title="EXAMPLE">
            What is your favorite dinosaur?
            <br />
            <br />
            <Select name="favorite_dinosaur" options={['T-Rex', 'Triceratops', 'Velociraptor', 'Stegosaurus', 'Brachiosaurus', 'Diplodocus', 'Spinosaurus', 'Allosaurus', 'Ankylosaurus', 'Iguanodon', 'Parasaurolophus', 'Pachycephalosaurus', 'Pteranodon', 'Apatosaurus', 'Archaeopteryx', 'Oviraptor', 'Gallimimus', 'Ceratosaurus', 'Deinonychus', 'Megalosaurus']} defaultValue="T-Rex" placeholder="Select your favorite dinosaur..." />
            <br />
            What is your favorite deep sea animal?
            <br />
            <br />
            <Select name="favorite_deepsea_animal" options={['Giant Squid', 'Vampire Squid', 'Anglerfish', 'Goblin Shark', 'Fangtooth Fish', 'Dumbo Octopus', 'Frilled Shark', 'Blobfish', 'Barreleye Fish', 'Lanternfish', 'Viperfish', 'Gulper Eel', 'Sea Spider', 'Dragonfish', 'Cookiecutter Shark', 'Hagfish', 'Chimaera', 'Deep Sea Octopus', 'Sea Pig', 'Sea Cucumber']} defaultValue="Giant Squid" placeholder="Select your favorite deep sea creature..." />
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="SIDEBAR LAYOUT">
          Sidebars are navigational panels that provide access to secondary actions or additional information. They can be static, collapsible, or resizable, adapting to design needs and screen sizes.
          <br />
          <br />
          <CardDouble title="QUOTES">
            <SidebarLayout
              isShowingHandle={true}
              sidebar={
                <>
                  “I want each of you to go through life making the most of your individuality. Like it or not, you will go out into the real world and be treated as an adult. Adults show each other no mercy. If you fail to cultivate within yourself a fight-back mentality, society will end up controlling you.” <br />
                  <br /> “Travel changes you. As you move through this life and this world you change things slightly, you leave marks behind, however small. And in return, life - and travel - leaves marks on you. Most of the time, those marks - on your body or on your heart - are beautiful. Often, though, they hurt.”
                </>
              }
            >
              “Never give up. Discover your own options, never count on others and have faith in the paths you discover for yourself. If someone else approves of this new way of life, all the better.”
              <br />
              <br />
              “I do think the idea that basic cooking skills are a virtue, that the ability to feed yourself and a few others with proficiency should be taught to every young man and woman as a fundamental skill, should become as vital to growing up as learning to wipe one’s own ass, cross the street by oneself, or be trusted with money.”
            </SidebarLayout>
          </CardDouble>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="SLIDER">
          Sliders are interactive UI elements that let users select a single value or range from a continuum. Designed as a horizontal track with a draggable handle, they are ideal for adjusting settings like volume, brightness, or color saturation.
          <br />
          <br />
          <Card title="EXAMPLE">
            <NumberRangeSlider defaultValue={0} min={0} max={5000} step={1} />
            <NumberRangeSlider defaultValue={0} min={0} max={10000} step={1} />
            <NumberRangeSlider defaultValue={0} min={0} max={15000} step={1} />
            <NumberRangeSlider defaultValue={0} min={0} max={20000} step={1} />
            <NumberRangeSlider defaultValue={0} min={0} max={100000} step={1} />
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="TABLE">
          A simple, declarative table component designed to streamline the creation of tables in JSX. It provides greater control over the structure and layout while evoking the aesthetics of old terminal interfaces (like MS-DOS).
          <br />
          <br />
          <CardDouble title="STARTUPS">
            <Table>
              <TableRow>
                <TableColumn style={{ width: `16ch` }}>
                  COMPANY
                  <br />
                  <Divider />
                </TableColumn>
                <TableColumn>
                  DESCRIPTION
                  <br />
                  <Divider />
                </TableColumn>
              </TableRow>
              <TableRow>
                <TableColumn>⍓ Bluesky</TableColumn>
                <TableColumn>Building a social internet.</TableColumn>
              </TableRow>
              <TableRow>
                <TableColumn>⍓ Coordination Network</TableColumn>
                <TableColumn>Collaborative tools for solving complex problems together.</TableColumn>
              </TableRow>
              <TableRow>
                <TableColumn>⍓ Doola</TableColumn>
                <TableColumn>Tools to start your US business from anywhere and keep it compliant.</TableColumn>
              </TableRow>
              <TableRow>
                <TableColumn>⍓ General Fabrication</TableColumn>
                <TableColumn>Machine tools to enable permanent industrial revolution.</TableColumn>
              </TableRow>
              <TableRow>
                <TableColumn>⍓ Glif</TableColumn>
                <TableColumn>Building foundational tools for the Filecoin Ecosystem.</TableColumn>
              </TableRow>
              <TableRow>
                <TableColumn>⍓ LigandAI®</TableColumn>
                <TableColumn>Combines cutting-edge predictive interactomics® with predictive targeting & delivery technology to enable diagnostically-responsive therapeutics.</TableColumn>
              </TableRow>
              <TableRow>
                <TableColumn>⍓ Lightcell</TableColumn>
                <TableColumn>An engine that uses light to make electricity.</TableColumn>
              </TableRow>
              <TableRow>
                <TableColumn>⍓ Orchid</TableColumn>
                <TableColumn>Mitigate risks with the world’s most advanced whole genome screening for embryos.</TableColumn>
              </TableRow>
              <TableRow>
                <TableColumn>⍓ Ordinary Objects</TableColumn>
                <TableColumn>Next-gen design tools for AR.</TableColumn>
              </TableRow>
              <TableRow>
                <TableColumn>⍓ Volantis Semiconductors</TableColumn>
                <TableColumn>Developing semiconductor chips for AI applications.</TableColumn>
              </TableRow>
              <TableRow>
                <TableColumn>⍓ Wilderness Labs</TableColumn>
                <TableColumn>Enables mainstream businesses and .NET developers to create sophisticated embedded-IoT solutions.</TableColumn>
              </TableRow>
              <TableRow>
                <TableColumn>⍓ YellowHeart</TableColumn>
                <TableColumn>Ticketing to empower fans, artists, and sports teams.</TableColumn>
              </TableRow>
            </Table>
          </CardDouble>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="TEXT AREA">
          Text areas are UI elements that allow users to input multiple lines of text, ideal for content like comments, reviews, or descriptions. Our text areas feature arrow key support, and a visible caret to track the cursor position. There is also an auto play feature for rendering text on the screen in sequence that you can interupt at anytime.
          <br />
          <br />
          <Card title="EXAMPLE">
            <TextArea />
          </Card>
          <Card title="BLINK">
            <TextArea isBlink />
          </Card>
          <Card title="PLACEHOLDER">
            <TextArea placeholder="There he took up again his great Ring in Barad-dur." />
          </Card>
          <Card title="AUTO PLAY">
            <TextArea autoPlay="The doom of the Elves is to be immortal, to love the beauty of the world, to bring it to full flower with their gifts of delicacy and perfection, to last while it lasts, never leaving it even when ‘slain’, but returning – and yet, when the Followers come, to teach them, and make way for them, to ‘fade’ as the Followers grow and absorb the life from which both proceed. The Doom (or the Gift) of Men is mortality, freedom from the circles of the world." autoPlaySpeedMS={50} />
          </Card>
          <Card title="AUTO PLAY SLOW">
            <TextArea autoPlay="All of us who do creative work, we get into it because we have good taste. But there is this gap. For the first couple years you make stuff, it’s just not that good. It’s trying to be good, it has potential, but it’s not. But your taste, the thing that got you into the game, is still killer. And your taste is why your work disappoints you." autoPlaySpeedMS={100} isBlink />
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="TOOLTIP">
          Tooltips are text labels that provide additional context or explanations for user interface elements, appearing on hover, focus, or touch. They are used to communicate brief, supplementary information or clarify unlabeled controls.
          <br />
          <br />
          <Card title="EXAMPLE">
            <RowSpaceBetween>
              <HoverComponentTrigger component="tooltip" text="The future depends on what we do in the present.">
                <ActionButton>TOP LEFT</ActionButton>
              </HoverComponentTrigger>
              <HoverComponentTrigger component="tooltip" text="An eye for an eye only ends up making the whole world blind.">
                <ActionButton>TOP RIGHT</ActionButton>
              </HoverComponentTrigger>
            </RowSpaceBetween>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <RowSpaceBetween>
              <HoverComponentTrigger component="tooltip" text="Live as if you were to die tomorrow">
                <ActionButton>BOTTOM LEFT</ActionButton>
              </HoverComponentTrigger>
              <HoverComponentTrigger component="tooltip" text="The best way to find yourself is to lose yourself in the service of others.">
                <ActionButton>BOTTOM RIGHT</ActionButton>
              </HoverComponentTrigger>
            </RowSpaceBetween>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="TREEVIEW">
          Tree Views are hierarchical list structures that allow users to navigate nested information or functionalities, commonly used for parent-child relationships like file directories or menus.
          <br />
          <br />
          <Card title="FILE SYSTEM">
            <TreeView defaultValue={true} isRoot title="Animal Kingdom" style={{ minWidth: '71ch' }}>
              <TreeView defaultValue={true} title="Chordata">
                <TreeView defaultValue={true} title="Mammalia">
                  <TreeView defaultValue={true} title="Primates">
                    <TreeView title="Hominidae.csv" isFile />
                    <TreeView title="Cercopithecidae.csv" isFile />
                  </TreeView>
                  <TreeView defaultValue={true} title="Carnivora">
                    <TreeView title="Felidae.csv" isFile />
                    <TreeView title="Canidae.csv" isFile />
                  </TreeView>
                  <TreeView defaultValue={true} title="Cetacea">
                    <TreeView title="Delphinidae.csv" isFile />
                    <TreeView title="Balaenidae.csv" isFile />
                  </TreeView>
                </TreeView>
                <TreeView defaultValue={true} title="Mammalia Rejects"></TreeView>
                <TreeView defaultValue={true} title="Aves">
                  <TreeView defaultValue={true} title="Passeriformes">
                    <TreeView title="Corvidae.csv" isFile />
                    <TreeView title="Fringillidae.csv" isFile />
                  </TreeView>
                  <TreeView defaultValue={true} title="Accipitriformes">
                    <TreeView title="Accipitridae.csv" isFile />
                    <TreeView title="Pandionidae.csv" isFile />
                  </TreeView>
                </TreeView>
                <TreeView defaultValue={true} title="Reptilia">
                  <TreeView defaultValue={true} title="Squamata">
                    <TreeView title="Viperidae.csv" isFile />
                    <TreeView title="Iguanidae.csv" isFile />
                  </TreeView>
                  <TreeView defaultValue={true} title="Testudines">
                    <TreeView title="Cheloniidae.csv" isFile />
                    <TreeView title="Testudinidae.csv" isFile />
                  </TreeView>
                </TreeView>
              </TreeView>
              <TreeView defaultValue={true} title="Arthropoda">
                <TreeView defaultValue={true} title="Insecta">
                  <TreeView defaultValue={true} title="Coleoptera">
                    <TreeView title="Coccinellidae.csv" isFile />
                    <TreeView title="Scarabaeidae.csv" isFile />
                  </TreeView>
                  <TreeView defaultValue={true} title="Diptera">
                    <TreeView title="Culicidae.csv" isFile />
                    <TreeView title="Syrphidae.csv" isFile />
                  </TreeView>
                </TreeView>
                <TreeView defaultValue={true} title="Arachnida">
                  <TreeView defaultValue={true} title="Araneae">
                    <TreeView title="Salticidae.csv" isFile />
                    <TreeView title="Theraphosidae.csv" isFile />
                  </TreeView>
                  <TreeView defaultValue={true} title="Scorpiones">
                    <TreeView title="Buthidae.csv" isFile />
                    <TreeView title="Scorpionidae.csv" isFile />
                  </TreeView>
                </TreeView>
              </TreeView>
            </TreeView>
          </Card>
          <br />
        </Accordion>
      </Grid>

      <Grid>
        <ActionListItem icon={`⭢`} href="https://internet.dev" target="_blank">
          Hire our studio to build your applications
        </ActionListItem>
        <ActionListItem icon={`⭢`} href="https://github.com/internet-development/www-sacred" target="_blank">
          View the SRCL source code
        </ActionListItem>
        <ActionListItem icon={`⭢`} href="https://vercel.com/home" target="_blank">
          Try our hosting provider Vercel
        </ActionListItem>
      </Grid>
      <ModalStack />
    </DefaultLayout>
  );
}
