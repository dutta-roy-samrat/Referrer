import { AppliedByType } from "@/components/post/description";
import StyledLink from "@/components/ui/link/styled-link";

import { API_URL } from "@/constants/environment-variables";

const AppliedByList = ({ applied_by }: { applied_by: AppliedByType[] }) => {
  return (
    <>
      <div>Applied By :</div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Experience</th>
            <th>Resume</th>
          </tr>
        </thead>
        <tbody>
          {applied_by.map(
            ({ id, first_name, last_name, resume, experience }) => (
              <tr key={id}>
                <td>
                  {first_name} {last_name}
                </td>
                <td>{experience}</td>
                <td>
                  <StyledLink
                    href={`${API_URL}${resume}`}
                    download={`${first_name}-${last_name}-resume.pdf`}
                    target="_blank"
                  >
                    Download
                  </StyledLink>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </>
  );
};

export default AppliedByList;
