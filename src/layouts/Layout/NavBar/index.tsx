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
import { UserService } from '@/services/Client/UserService';
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
import config from '@/config';
const NavBar: React.FC = () => {
  const { theme } = useTheme();
  const [menuOpen, setMenuOpen] = React.useState(false); // Estado para controle do menu mobile

  const navigate = useNavigate();

  const { token, scopes, logout, name, image} = useUserStore(state => ({
    token: state.token,
    scopes: state.scopes,
    logout: state.logout,
    name: state.name,
    image: state.image
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
    UserService.logout().then(() => {
      logout();
      navigate('/');
    })
    .catch((error) => {
      console.log(error);
    });
  }
  console.log('image', image);
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

        {/* Links e botões */}
        <div className={`flex-grow-0 sm:flex sm:items-center ${menuOpen ? 'block' : 'hidden'} sm:block`}>
          <div className='p-3 hidden sm:block'>
            <ModeToggle />
          </div>
          <Link to="/offer-list" className='pr-5'>
            <NavBarButton label='All Offers'/>
          </Link>
          {token ? (
              <DropdownMenu>
                <DropdownMenuTrigger className='flex'>
                  <DropdownMenuLabel className='text-lg'>{name}</DropdownMenuLabel>
                    <Avatar className="mr-2">
                      <AvatarImage src={image} alt="Avatar" />
                      <AvatarFallback>{name}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={4} className='mt-2' align='end'>
                  <Link to="/account">
                        <DropdownMenuItem>Account Management</DropdownMenuItem>
                  </Link>
                  {scopes.includes('provider') && (
                    <div>
                    <Link to="/account/your-offers">
                      <DropdownMenuItem>
                          My Offers
                      </DropdownMenuItem>
                    </Link>
                    <Link to="/account/dashboard">
                      <DropdownMenuItem>
                        Dashboard
                      </DropdownMenuItem> 
                    </Link>
                    </div>
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