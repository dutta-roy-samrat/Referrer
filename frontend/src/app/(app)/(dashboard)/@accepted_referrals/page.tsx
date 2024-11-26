import Post from "@/components/post-card";
import Link from "next/link";

const AcceptedReferrals = () => {
  const dummyData = [
    {
      experience: 3,
      companyName: "Vinsol",
      jobTitle: "Frontend Engineer",
      salary: 12,
      expiry: "12/10/2021",
      location: "Delhi",
    },
    {
      experience: 3,
      companyName: "Vinsol",
      jobTitle: "Frontend Engineer",
      salary: 12,
      expiry: "12/10/2021",
      location: "Delhi",
    },
    {
      experience: 3,
      companyName: "Vinsol",
      jobTitle: "Frontend Engineer",
      salary: 12,
      expiry: "12/10/2021",
      location: "Delhi",
    },
    {
      experience: 3,
      companyName: "Vinsol",
      jobTitle: "Frontend Engineer",
      salary: 12,
      expiry: "12/10/2021",
      location: "Delhi",
    },
    {
      experience: 3,
      companyName: "Vinsol",
      jobTitle: "Frontend Engineer",
      salary: 12,
      expiry: "12/10/2021",
      location: "Delhi",
    },
    {
      experience: 3,
      companyName: "Vinsol",
      jobTitle: "Frontend Engineer",
      salary: 12,
      expiry: "12/10/2021",
      location: "Delhi",
    },
  ];
  return (
    <article className="pt-5 pb-16 px-4 sm:px-8">
      <header className="flex justify-between mb-4">
        <div className="font-bold text-xl">Successfully Referred To</div>
        <Link href="/">View All &gt; &gt;</Link>
      </header>
      <div className="flex gap-4 overflow-auto pb-3">
        {dummyData.map((data, idx) => (
          <Post key={idx} {...data} />
        ))}
      </div>
    </article>
  );
};

export default AcceptedReferrals;
