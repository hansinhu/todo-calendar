
/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react';
import Markdown from 'react-markdown';
import { checkA11y } from '@storybook/addon-a11y';
import { storiesOf } from '@storybook/react';
import { withConsole } from '@storybook/addon-console';
import { withViewport } from '@storybook/addon-viewport';
import { withInfo } from '@storybook/addon-info';
import RowsSource from 'rc-source-loader!../examples/rows';
import SimpleSource from 'rc-source-loader!../examples/simple';
import ThemeSource from 'rc-source-loader!../examples/theme';
import Rows from '../examples/rows';
import Simple from '../examples/simple';
import Theme from '../examples/theme';
import READMECode from '../README.md';

storiesOf('@todo-calendar/for-react', module)
.addDecorator(checkA11y) 
.addDecorator(withInfo)
.addDecorator((storyFn, context) => withConsole()(storyFn)(context))
.addDecorator(withViewport())
.add(
  'readMe',
  () => (
    <div
      className="markdown-body entry-content"
      style={{
        padding: 24,
      }}
    >
      <Markdown escapeHtml={false} source={READMECode} />
    </div>
  ),
  {
    source: {
      code: READMECode,
    },
  },
)
.add('rows', () => <Rows />,{
    source: {
      code: RowsSource,
    },
  })
.add('simple', () => <Simple />,{
    source: {
      code: SimpleSource,
    },
  })
.add('theme', () => <Theme />,{
    source: {
      code: ThemeSource,
    },
  })
