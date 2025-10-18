import { notFound } from 'next/navigation';
import CollectionDetail from '@/components/CollectionDetail';

interface CollectionPageProps {
  params: {
    slug: string;
  };
}

export default function CollectionPage({ params }: CollectionPageProps) {
  if (!params.slug) {
    notFound();
  }

  return <CollectionDetail slug={params.slug} />;
}

