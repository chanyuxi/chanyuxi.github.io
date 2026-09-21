import type { ComponentType } from 'react'
import type { Components } from 'react-markdown'

import Poetry from './custom/poetry'
import H from './h'

export enum MarkdownDirective {
  Poetry = 'md-poetry',
}

export const directiveTagMap: Record<string, MarkdownDirective> = {
  poetry: MarkdownDirective.Poetry,
}

type MarkdownDirectiveInjectedProps = {
  children?: MarkdownDirectiveRuntimeProps['children']
}

type MarkdownDirectiveRenderer = ComponentType<MarkdownDirectiveRuntimeProps>

type MarkdownDirectiveRuntimeProps = Pick<
  ReactMarkdownComponentProps<'div'>,
  'children' | 'node'
>

type ReactMarkdownComponent<Tag extends keyof Components> = Extract<
  NonNullable<Components[Tag]>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ComponentType<any>
>

type ReactMarkdownComponentProps<Tag extends keyof Components>
  = ReactMarkdownComponent<Tag> extends ComponentType<infer Props> ? Props : never

export const markdownDirectiveCompMap = {
  [MarkdownDirective.Poetry]: withMarkdownProps(Poetry),
} satisfies Record<MarkdownDirective, MarkdownDirectiveRenderer>

function withMarkdownProps<Props extends object>(
  Component: ComponentType<MarkdownDirectiveInjectedProps & Props>,
): MarkdownDirectiveRenderer {
  return function MarkdownDirectiveComponent({
    children,
    node,
  }: MarkdownDirectiveRuntimeProps) {
    const props = {
      ...node?.properties,
      children,
    } as MarkdownDirectiveInjectedProps & Props

    return <Component {...props} />
  }
}

const components = {
  /* Header */
  h1: ({ children }) => <H level={1}>{children}</H>,
  h2: ({ children }) => <H level={2}>{children}</H>,
  h3: ({ children }) => <H level={3}>{children}</H>,
  h4: ({ children }) => <H level={4}>{children}</H>,
  h5: ({ children }) => <H level={5}>{children}</H>,
  h6: ({ children }) => <H level={6}>{children}</H>,
} satisfies Components

export default { ...components, ...markdownDirectiveCompMap } as Components
