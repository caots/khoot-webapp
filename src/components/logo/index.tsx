import { useRouter } from 'next/router';

const Logo = (props: any) => {
  const router = useRouter();
  return <img className="logo" alt="Logo" src={`${router.basePath}/logo.png`} />;
};

export default Logo;
