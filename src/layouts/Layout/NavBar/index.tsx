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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const NavBar: React.FC = () => {
  const { theme } = useTheme();
  const [menuOpen, setMenuOpen] = React.useState(false); // Estado para controle do menu mobile

  const navigate = useNavigate();

  const { token, scopes, logout, name} = useUserStore(state => ({
    token: state.token,
    scopes: state.scopes,
    logout: state.logout,
    name: state.name
  }));

  useEffect(() => {
    console.log('token', token);
    console.log('scopes', scopes);
  }, [token, scopes])

  
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
          {token ? (
              <DropdownMenu>
                <DropdownMenuTrigger className='flex'>
                  <DropdownMenuLabel className='text-lg'>{name}</DropdownMenuLabel>
                    <Avatar className="mr-2">
                      <AvatarImage src="https://randomuser.me/api/portraits/men/3.jpg" alt="Avatar" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={4} className='mt-2' align='end'>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  {scopes.includes('PROVIDER') && (
                    <Link to="/your-offers">
                        <DropdownMenuItem>Your Offers</DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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