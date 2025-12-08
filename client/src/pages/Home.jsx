import { useOutletContext } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import QuickCategories from '../components/QuickCategories';
import FlashSale from '../components/FlashSale';
import TodaysForYou from '../components/TodaysForYou';
import BestSellingStore from '../components/BestSellingStore';
import ProductsSection from '../components/ProductsSection';

function Home() {
  const { showNotification, onLoginRequired, searchQuery } = useOutletContext();

  return (
    <>
      <HeroBanner />
      <QuickCategories />
      <FlashSale />
      <TodaysForYou 
        showNotification={showNotification} 
        onLoginRequired={onLoginRequired}
        searchQuery={searchQuery}
      />
      <BestSellingStore />
      <ProductsSection 
        showNotification={showNotification} 
        onLoginRequired={onLoginRequired}
        searchQuery={searchQuery}
      />
    </>
  );
}

export default Home;
