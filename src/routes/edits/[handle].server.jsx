import {
  // useLocalization,
  Seo,
  useServerAnalytics,
  ShopifyAnalyticsConstants,
  gql,
} from '@shopify/hydrogen';
import MarkdownToJSX from 'markdown-to-jsx';
import {Suspense} from 'react';

import {useContentfulQuery} from '~/api/useContentfulQuery';

import {PageHeader} from '~/components';
import {NotFound, Layout} from '~/components/index.server';

export default function Page({params}) {
  // const {
  //   language: {isoCode: languageCode},
  // } = useLocalization();

  const {handle} = params;
  const slug = `/pages/${handle}`;

  const {
    data: {pageCollection},
  } = useContentfulQuery({
    query: CONTENTFUL_QUERY,
    variables: {
      slug,
    },
  });

  const page = pageCollection?.items?.[0];

  if (!pageCollection?.total) {
    return <NotFound />;
  }

  useServerAnalytics({
    contentful: {
      pageType: ShopifyAnalyticsConstants.pageType.edit,
      resourceId: page.id,
    },
  });

  return (
    <Layout>
      <Suspense>
        <Seo type="page" data={page} />
      </Suspense>
      <PageHeader heading={page.title}>
        <MarkdownToJSX className="prose dark:prose-invert">
          {page.content}
        </MarkdownToJSX>
      </PageHeader>
    </Layout>
  );
}

const CONTENTFUL_QUERY = gql`
  query getEdits($slug: String!) {
    editCollection(where: {slug: $slug}) {
      total
      items {
        ... on Edit {
          category
          colorAccent
          colorBackground
          colorText
          credits
          date
          deck
          eyebrow
          slug
          title
          imageLandscape {
            contentType
            description
            fileName
            height
            size
            title
            width
          }
          videoLandscape {
            contentType
            description
            fileName
            height
            size
            title
            width
          }
          # modulesCollection {
          #   total
          #   items {
          #     __typename
          #   }
          # }
          # relatedFeaturesCollection {
          #   total
          #   items {
          #     category
          #     date
          #     slug
          #     title
          #     imageLandscape {
          #       contentType
          #       description
          #       fileName
          #       height
          #       title
          #       width
          #     }
          #   }
          # }
        }
      }
    }
  }
`;
