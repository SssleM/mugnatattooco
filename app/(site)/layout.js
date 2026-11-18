import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Effects from '@/components/Effects';
import Preloader from '@/components/Preloader';
import { getSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }) {
  const { shop } = await getSettings();
  return (
    <>
      <Preloader />
      <Effects />
      <Nav phone={shop.phone} email={shop.email} />
      <main>{children}</main>
      <Footer shop={shop} />
    </>
  );
}
