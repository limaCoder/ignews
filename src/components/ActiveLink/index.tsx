import { cloneElement, ReactElement } from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}

export function ActiveLink({ children, activeClassName, ...rest }: ActiveLinkProps) {
  const { asPath } = useRouter(); // pegar o caminho no qual a página está

  const className = asPath === rest.href ? activeClassName : '' // se o href do link for igual ao caminho da página, aplique o acttive, senão deixe sem

  return (
    <Link {...rest}>
      {cloneElement(children, { // clonando o elemento children e aplicando a clasname a ela
        className,
      })}
    </Link>
  );
}