import ProductDetail from '@/components/ProductDetail';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductDetail slug={params.slug} />;
}


