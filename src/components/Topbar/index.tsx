import { cn } from '@/lib/utils';

interface Props {
  name: string | React.ReactNode;
  description?: string | React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}
function Topbar(props: Props) {
  const { name, description: subTitle, children, className } = props;
  return (
    <div className={cn('mb-10 flex items-center justify-between', className)}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
        <p className="text-muted-foreground">{subTitle}</p>
      </div>
      {children}
    </div>
  );
}

export default Topbar;
