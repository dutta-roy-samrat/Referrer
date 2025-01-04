const DashboardLayout = ({
  children,
  posted_referrals,
  applied_referrals,
}: {
  children: React.ReactNode;
  posted_referrals: React.ReactNode;
  applied_referrals: React.ReactNode;
}) => (
  <>
    {children}
    {posted_referrals}
    {applied_referrals}
  </>
);
export default DashboardLayout;
