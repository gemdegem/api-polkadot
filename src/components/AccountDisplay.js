export const AccountDisplay = ({ account }) => {
  if (!account) return null;

  return (
    <div>
      <span>
        Connected as: {account.meta.name} ({account.address})
      </span>
    </div>
  );
};
