import Post from "@/components/post-card";
import Link from "next/link";

const PostedReferrals = () => {
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
    <article className="pt-14 pb-5 px-4 sm:px-8">
      <header className="flex justify-between mb-4">
        <div className="font-bold text-xl">Your Posts</div>
        <Link href="/my-posts">View All &gt; &gt;</Link>
      </header>
      <section className="flex gap-4 overflow-auto pb-3">
        {dummyData.map((data, idx) => (
          <Post key={idx} {...data} showDeleteBtn/>
        ))}
      </section>
    </article>
  );
};

export default PostedReferrals;
