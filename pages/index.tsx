import type { NextPage } from 'next'
import dynamic from 'next/dynamic';
import Head from 'next/head'
const MainLayout = dynamic(() => import('../components/MainLayout'));
const ProductList = dynamic(() => import('../components/ProductList'));

const Home: NextPage = () => {
  return (
    <MainLayout>
      <Head>
        <title>Automation Solutionz</title>
      </Head>
      <ProductList />
    </MainLayout>
  )
}

export default Home
