// components/LessonContent.tsx
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';

type LessonContentProps = {
  content: string;
};

export default async function LessonContent({ content }: LessonContentProps) {
  const mdxSource = await serialize(content) as MDXRemoteSerializeResult;
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      {/*<MDXRemote {...mdxSource} />*/}
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}