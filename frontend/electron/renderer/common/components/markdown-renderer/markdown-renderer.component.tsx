import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import style from './markdown-renderer.module.less';

interface MarkdownRendererProps {
    mdContent: string;
}

const MarkdownRenderer = ({
    mdContent,
}: MarkdownRendererProps) => (
    <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        className={style.component}
    >
        {mdContent}
    </Markdown>
);

export default MarkdownRenderer;
