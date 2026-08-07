import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FullWidthListLayout from "../../layouts/FullWidthListLayout.jsx";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export default function Recruiters() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/admin/recruiters")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load recruiters");
        }
        return res.json();
      })
      .then((data) => {
        setRecruiters(data);
      })
      .catch((err) => {
        console.log(err);
        showToast("Unable to load recruiters", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/recruiters/${id}/${status}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Failed");
      }

      setRecruiters((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: status.toUpperCase(),
              }
            : r
        )
      );

      showToast(
        status === "approve"
          ? "Recruiter approved successfully"
          : "Recruiter blocked successfully",
        status === "approve" ? "success" : "error"
      );
    } catch (err) {
      console.log(err);
      showToast("Operation failed", "error");
    }
  };

  if (loading) {
    return (
      <h2 className="text-center mt-10 text-lg font-semibold">
        Loading recruiters...
      </h2>
    );
  }

  return (
    <FullWidthListLayout
      role="admin"
      userName="Admin"
      onLogout={() => navigate("/login")}
      title="Recruiter Management"
      subtitle="Review and manage recruiter registrations."
    >
      {recruiters.length === 0 ? (
        <EmptyState
          title="No Recruiters Found"
          description="There are currently no recruiter requests."
        />
      ) : (
        <div className="space-y-5">
          {recruiters.map((r) => (
            <Card key={r.id}>
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5">
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {r.companyName}
                  </h2>

                  <p className="text-sm text-gray-600">
                    <strong>Recruiter:</strong> {r.fullName}
                  </p>

                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> {r.email}
                  </p>

                  <p className="text-sm text-gray-600">
                    <strong>Designation:</strong> {r.designation}
                  </p>

                  <p className="text-sm text-gray-600">
                    <strong>Industry:</strong> {r.industry}
                  </p>

                  <p className="text-sm text-gray-600">
                    <strong>Mobile:</strong> {r.mobileNumber}
                  </p>

                  <p className="text-sm text-gray-600">
                    <strong>Location:</strong>{" "}
                    {r.city}, {r.state}, {r.country}
                  </p>

                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      r.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : r.status === "BLOCKED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => updateStatus(r.id, "approve")}
                    disabled={r.status === "APPROVED"}
                  >
                    Approve
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => updateStatus(r.id, "block")}
                    disabled={r.status === "BLOCKED"}
                  >
                    Block
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </FullWidthListLayout>
  );
}