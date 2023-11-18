interface Props {
  moreAction: JSX.Element;
  className?: string;
  title?: string;
}
function HeaderLayout(props: Props) {
  const { moreAction, className, title } = props;
  return (
    <div
      className={` w-full right-0 h-[47px] bg-[#ffffff] flex items-center justify-end gap-2 btn_action_form ${className} mb-5 md:mb-3 px-3`}
    >
      <div className="line-clamp-1 text-lg flex-1">{title}</div>
      {moreAction}
    </div>
  );
}

export default HeaderLayout;
