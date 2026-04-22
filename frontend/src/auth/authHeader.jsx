import { Link, useLocation } from "react-router-dom";

const AuthHeader = () => {
  const location = useLocation();

  // Определяем, на какой странице мы находимся
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/invitations";

  // Текст и целевой путь для кнопки
  const buttonText = isLoginPage ? "Отправить приглашение" : "Войти";
  const targetPath = isLoginPage ? "/invitations" : "/login";

  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-dark-1000 backdrop-blur-md ">
      <div className="flex h-20 lg:h-24 items-center gap-3 px-4 sm:px-6 lg:px-12 max-w-screen-2xl mx-auto">
        {/* Левая кнопка переключения между логином и регистрацией */}
        {(isLoginPage || isRegisterPage) && (
          <Link
            to={targetPath}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 rounded-2xl text-white font-medium transition-all whitespace-nowrap"
          >
            {buttonText}
          </Link>
        )}
      </div>
    </header>
  );
};

export default AuthHeader;
