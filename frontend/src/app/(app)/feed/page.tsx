import PostCard from "@/components/post-card";

const FeedPage = () => {
  const dummyData = [
    {
      skills: ["react", "typescript"],
      experience: 3,
      companyName: "Vinsol",
      jobTitle: "Frontend Engineer",
      salary: 12,
      expiry: "12/10/2021",
      location:"Delhi"
    },
    {
      skills: ["react", "typescript"],
      experience: 3,
      companyName: "Vinsol",
      jobTitle: "Frontend Engineer",
      salary: 12,
      expiry: "12/10/2021",
      location:"Delhi"
    },
    {
      skills: ["react", "typescript"],
      experience: 3,
      companyName: "Vinsol",
      jobTitle: "Frontend Engineer",
      salary: 12,
      expiry: "12/10/2021",
      location:"Delhi"
    },
    {
      skills: ["react", "typescript"],
      experience: 3,
      companyName: "Vinsol",
      jobTitle: "Frontend Engineer",
      salary: 12,
      expiry: "12/10/2021",
      location:"Delhi"
    },
    {
      skills: ["react", "typescript"],
      experience: 3,
      companyName: "Vinsol",
      jobTitle: "Frontend Engineer",
      salary: 12,
      expiry: "12/10/2021",
      location:"Delhi"
    },
    {
      skills: ["react", "typescript"],
      experience: 3,
      companyName: "Vinsol",
      jobTitle: "Frontend Engineer",
      salary: 12,
      expiry: "12/10/2021",
      location:"Delhi"
    },
    {
      skills: ["react", "typescript"],
      experience: 3,
      companyName: "Vinsol",
      jobTitle: "Frontend Engineer",
      salary: 12,
      expiry: "12/10/2021",
      location:"Delhi"
    },
  ];
  return (
    <div className="m-5 mt-10">
      <header className="mb-4 font-bold">
        Live Feed{" "}
        <span className="bg-green-500 rounded-full px-2 py-0 ml-2 animate-pulse" />
      </header>
      <main className="flex flex-col gap-4">
        {dummyData.map((data, idx) => (
          <PostCard key={idx} {...data} />
        ))}
      </main>
    </div>
  );
};

export default FeedPage;
