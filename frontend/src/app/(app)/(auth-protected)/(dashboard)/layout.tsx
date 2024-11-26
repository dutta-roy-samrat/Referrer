const DashboardLayout = ({
  children,
  posted_referrals,
  accepted_referrals,
}: {
  children: React.ReactNode;
  posted_referrals: React.ReactNode;
  accepted_referrals: React.ReactNode;
}) => (
  <>
    {children}
    {posted_referrals}
    {accepted_referrals}
  </>
);
export default DashboardLayout;
