import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export default function UpdateProfile() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const loginData = JSON.parse(
    localStorage.getItem("student")
  );

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!loginData) {
      navigate("/login");
      return;
    }

    fetch(
      `http://localhost:8080/api/student/profile/${encodeURIComponent(loginData.email)}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Profile not found");
        }

        return res.json();
      })
      .then((data) => {
        setStudent(data);
      })
      .catch((error) => {
        console.log(error);

        showToast(
          "Unable to load profile data.",
          "error"
        );
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);


  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8080/api/student/profile/${encodeURIComponent(loginData.email)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(student),
        }
      );


      if (!response.ok) {

        const errorMessage = await response.text();

        console.log(
          "Backend Error:",
          errorMessage
        );

        throw new Error(
          "Profile update failed"
        );
      }


      showToast(
        "Profile updated successfully!",
        "success"
      );


      setTimeout(() => {
        navigate("/student/dashboard");
      }, 1000);


    } catch (error) {

      console.log(error);


      if (error.message === "Failed to fetch") {

        showToast(
          "Server is unavailable. Please try again later.",
          "error"
        );

      } else {

        showToast(
          "Profile update failed. Please try again.",
          "error"
        );

      }

    }
  };


  if (loading) {
    return (
      <h2 className="text-center mt-10">
        Loading...
      </h2>
    );
  }


  if (!student) {
    return (
      <h2 className="text-center mt-10">
        Profile not found
      </h2>
    );
  }


  return (
    <div className="max-w-3xl mx-auto mt-10">

      <Card>

        <h2 className="text-2xl font-bold mb-6">
          Update Profile
        </h2>


        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            className="border p-3 w-full rounded"
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={student.fullName || ""}
            onChange={handleChange}
          />


          <input
            className="border p-3 w-full rounded"
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={student.mobileNumber || ""}
            onChange={handleChange}
          />


          <input
            className="border p-3 w-full rounded"
            type="text"
            value={student.course || ""}
            disabled
          />


          <input
            className="border p-3 w-full rounded"
            type="text"
            value={student.branch || ""}
            disabled
          />


          <input
            className="border p-3 w-full rounded"
            type="number"
            step="0.01"
            name="cgpa"
            placeholder="CGPA"
            value={student.cgpa || ""}
            onChange={handleChange}
          />


          <input
            className="border p-3 w-full rounded"
            type="text"
            name="passingYear"
            placeholder="Passing Year"
            value={student.passingYear || ""}
            onChange={handleChange}
          />


          <textarea
            className="border p-3 w-full rounded"
            name="skills"
            placeholder="Skills"
            value={student.skills || ""}
            onChange={handleChange}
          />


          <input
            className="border p-3 w-full rounded"
            type="text"
            name="linkedinUrl"
            placeholder="LinkedIn URL"
            value={student.linkedinUrl || ""}
            onChange={handleChange}
          />


          <Button>
            Save Changes
          </Button>


        </form>

      </Card>

    </div>
  );
}