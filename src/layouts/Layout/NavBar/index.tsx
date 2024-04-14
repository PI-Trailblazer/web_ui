// layouts/Navbar/index.tsx
import React, { useEffect } from 'react';
import { ModeToggle } from '@/components/mode-toggle';
import logo1 from '@/assets/LogoLight.svg';
import logo2 from '@/assets/LogoDark.svg';
import { Link } from 'react-router-dom';
import { NavBarButton } from '@/layouts/Layout/NavBar/components/NavBarButton';
import { useTheme } from '@/components/theme-provider';
import { Input } from '@/components/ui/input'; // Certifique-se de que o caminho de importação está correto
import { Search } from "lucide-react";
import { Menu } from 'lucide-react'; // Icone de menu para visão mobile
import { useUserStore } from '@/stores/useUserStore';
import { useNavigate } from 'react-router-dom';

const NavBar: React.FC = () => {
  const { theme } = useTheme();
  const [menuOpen, setMenuOpen] = React.useState(false); // Estado para controle do menu mobile

  const navigate = useNavigate();

  const { token, roles, logout } = useUserStore((state: { token: any; roles: any; logout: any; }) => ({
    token: state.token,
    roles: state.roles,
    logout: state.logout
  }));

  useEffect(() => {
    console.log('token', token);
    console.log('roles', roles);
  }, [token, roles])

  
  // Função para alternar o menu mobile
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  return (
    <nav className="navbar fixed top-0 left-0 right-0 z-50  bg-gradient-to-t from-transparent to-background">
      <div className="flex items-center justify-between mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center">
          <img src={theme === 'light' ? logo1 : logo2} alt="TrailBlazer" className="h-8" />
        </Link>

        {/* Botão de menu para visão mobile */}
        <button onClick={toggleMenu} className="text-3xl sm:hidden">
          <Menu />
        </button>

        {/* Formulário de pesquisa */}
        <div className="hidden sm:block sm:flex-1 lg:flex-initial">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 pr-3 py-2 rounded-md shadow-md w-full sm:w-[5rem] md:w-[10rem] lg:w-[20rem] xl:w-[30rem]"
            />
          </div>
        </div>

        {/* Links e botões */}
        <div className={`flex-grow-0 sm:flex sm:items-center ${menuOpen ? 'block' : 'hidden'} sm:block`}>
          <div className='p-3 hidden sm:block'>
            <ModeToggle />
          </div>
          <Link to="/offer-list" className='pr-5'>
            <NavBarButton label='Offers'/>
          </Link>
          {roles.includes('PROVIDER') && (
            <Link to="/your-offers" className='pr-5'>
              <NavBarButton label='Your Offers'/>
            </Link>
          )}
          {token ? (
            // Renderize o botão Logout se o token existir
            <button onClick={handleLogout} className='pr-5'>
              <NavBarButton label='Logout'/>
            </button>
          ) : (
            <>
              <Link to="/login" className='pr-5'>
                <NavBarButton label='Login'/>
              </Link>
              <Link to="/register">
                <NavBarButton label='Register'/>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
