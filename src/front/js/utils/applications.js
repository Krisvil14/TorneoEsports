const getTeamApplications = async (teamId) => {
  try {
    const response = await fetch(process.env.BACKEND_URL + `/api/teams/${teamId}/applications`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
};

const approveApplication = async (applicationId) => {
  try {
    const response = await fetch(process.env.BACKEND_URL + `/api/applications/${applicationId}/approve`, {
      method: "POST",
    });
    if (response.ok) {
      return true;
    } else {
      console.error("Error approving application:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Error approving application:", error);
    return false;
  }
};

const rejectApplication = async (applicationId) => {
  try {
    const response = await fetch(process.env.BACKEND_URL + `/api/applications/${applicationId}/reject`, {
      method: "POST",
    });
    if (response.ok) {
      return true;
    } else {
      console.error("Error rejecting application:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Error rejecting application:", error);
    return false;
  }
};

export { getTeamApplications, approveApplication, rejectApplication };
