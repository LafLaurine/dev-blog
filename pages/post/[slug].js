import React from 'react'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'

export default function PostTemplate({ content, data }) {
  const frontmatter = data

  return (
    <div>
      <ReactMarkdown source={content} />
    </div>
  )
}

PostTemplate.getInitialProps = async (context) => {
  const { slug } = context.query
  // Import our .md file using the `slug` from the URL
  const content = await import(`../../content/${slug}.md`)

  // Parse .md data through `matter`
  const data = matter(content.default)

  // Pass data to the component props
  return { ...data }
}
