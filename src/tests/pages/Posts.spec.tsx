import {render, screen} from "@testing-library/react";
import Posts, { getStaticProps } from "../../pages/posts";
import {stripe} from '../../services/stripe';
import {mocked} from "ts-jest/utils";
import {getPrismicClient} from '../../services/prismic';

jest.mock('../../services/stripe');

const posts = [
  { 
    slug: 'my-new-post',
    title: 'My new Post',
    excerpt: 'Post excerpt',
    updatedAt: 'March, 10'
  }
]

jest.mock('../../services/prismic');

describe("Post page", () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText('My new Post')).toBeInTheDocument();
  })

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'My-new-post',
            data: {
              title: [
                { type: 'heading', text: 'My new post' }
              ],
              content: [
                 { type: 'paragraph', text: 'Post excerpt' }
              ],
            },
            last_publication_date: '04-01-2021',
          }
        ]
      })
    } as any)

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'my-new-post',
            title: 'My new Post',
            excerpt: 'Post excerpt',
            updatedAt: '01 de Abril de 2021,'
          }]
        }
      })
    )
  })


})