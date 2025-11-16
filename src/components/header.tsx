interface IProperties {
  children: React.ReactNode;
  size: 1 | 2 | 3 | 4;
}

export function Header({ children, size }: Readonly<IProperties>) {
  switch (size) {
    case 1: {
      return <h1 className="text-2xl font-bold">{children}</h1>;
    }
    case 2: {
      return <h2 className="text-xl">{children}</h2>;
    }
    case 3: {
      return <h3>{children}</h3>;
    }
    case 4: {
      return <h4>{children}</h4>;
    }
  }
}
