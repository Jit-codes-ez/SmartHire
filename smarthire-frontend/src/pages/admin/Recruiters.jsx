import { useEffect, useMemo, useState } from "react";
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

  const [activeTab, setActiveTab] = useState("PENDING");

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const itemsPerPage = 8;



  // Fetch recruiters

  const loadRecruiters = async () => {

    try {

      setLoading(true);


      const response = await fetch(
        "http://localhost:8080/api/admin/recruiters"
      );


      if (!response.ok) {
        throw new Error("Failed to load recruiters");
      }


      const data = await response.json();

      setRecruiters(data);


    } catch(error) {

      console.log(error);

      showToast(
        "Unable to load recruiters",
        "error"
      );


    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    loadRecruiters();

  }, []);




  // Approve / Reject recruiter

  const updateStatus = async(id,status)=>{

    try {


      const response = await fetch(
        `http://localhost:8080/api/admin/recruiters/${id}/${status}`,
        {
          method:"PUT"
        }
      );


      if(!response.ok){
        throw new Error("Failed");
      }



      setRecruiters(prev=>

        prev.map(r=>

          r.id===id
          ?
          {
            ...r,
            status:
            status==="approve"
            ?
            "APPROVED"
            :
            "REJECTED"
          }
          :
          r

        )

      );



      showToast(
        status==="approve"
        ?
        "Recruiter approved"
        :
        "Recruiter rejected",
        "success"
      );



    }catch(error){

      console.log(error);

      showToast(
        "Operation failed",
        "error"
      );

    }

  };




  // Delete recruiter

  const deleteRecruiter = async(id)=>{


    const confirmDelete =
      window.confirm(
        "Delete this recruiter permanently?"
      );


    if(!confirmDelete)
      return;



    try{


      const response = await fetch(
        `http://localhost:8080/api/admin/recruiters/${id}`,
        {
          method:"DELETE"
        }
      );



      if(!response.ok){

        throw new Error("Delete failed");

      }



      setRecruiters(prev=>

        prev.filter(
          recruiter=>recruiter.id!==id
        )

      );



      showToast(
        "Recruiter deleted",
        "success"
      );



    }catch(error){

      console.log(error);

      showToast(
        "Delete failed",
        "error"
      );

    }


  };




  // Statistics


  const stats = useMemo(()=>{

    return {

      total:
      recruiters.length,


      approved:
      recruiters.filter(
        r=>r.status==="APPROVED"
      ).length,


      pending:
      recruiters.filter(
        r=>r.status==="PENDING"
      ).length,


      rejected:
      recruiters.filter(
        r=>r.status==="REJECTED"
      ).length

    };


  },[recruiters]);





  // Filter recruiters


  const filteredRecruiters =
    useMemo(()=>{


      return recruiters.filter(r=>{


        const matchesTab =
          r.status===activeTab;


        const text =
          `${r.companyName}
          ${r.fullName}
          ${r.email}`
          .toLowerCase();



        return (
          matchesTab &&
          text.includes(
            search.toLowerCase()
          )
        );


      });


    },[
      recruiters,
      activeTab,
      search
    ]);




  // Pagination


  const totalPages =
    Math.ceil(
      filteredRecruiters.length/itemsPerPage
    );


  const currentRecruiters =
    filteredRecruiters.slice(
      (page-1)*itemsPerPage,
      page*itemsPerPage
    );

  if (loading) {

    return (

      <FullWidthListLayout
        role="admin"
        userName="Admin"
        onLogout={() => navigate("/login")}
        title="Recruiter Management"
        subtitle="Review and manage recruiter registrations."
      >

        <div className="flex justify-center py-20">

          <p className="text-lg font-semibold">
            Loading recruiters...
          </p>

        </div>

      </FullWidthListLayout>

    );

  }




  return (

    <FullWidthListLayout

      role="admin"

      userName="Admin"

      onLogout={() => navigate("/login")}

      title="Recruiter Management"

      subtitle="Approve, reject and manage recruiter accounts."

      action={

        <Button
          onClick={() =>
            navigate("/admin/recruiters/add")
          }
        >
          + Add Recruiter
        </Button>

      }


      filters={

        <div className="flex flex-col md:flex-row gap-4">


          <input

            type="text"

            value={search}

            onChange={(e)=>{

              setSearch(e.target.value);

              setPage(1);

            }}

            placeholder="Search company, recruiter or email..."

            className="flex-1 border rounded-lg px-4 py-2"

          />


          <Button
            variant="secondary"
            onClick={loadRecruiters}
          >
            Refresh
          </Button>


        </div>

      }


    >



      {/* Statistics */}


      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">


        <Card>

          <p className="text-gray-500 text-sm">
            Total Recruiters
          </p>

          <h2 className="text-3xl font-bold mt-2 text-blue-600">
            {stats.total}
          </h2>

        </Card>



        <Card>

          <p className="text-gray-500 text-sm">
            Approved
          </p>

          <h2 className="text-3xl font-bold mt-2 text-green-600">
            {stats.approved}
          </h2>

        </Card>



        <Card>

          <p className="text-gray-500 text-sm">
            Pending
          </p>

          <h2 className="text-3xl font-bold mt-2 text-yellow-600">
            {stats.pending}
          </h2>

        </Card>



        <Card>

          <p className="text-gray-500 text-sm">
            Rejected
          </p>

          <h2 className="text-3xl font-bold mt-2 text-red-600">
            {stats.rejected}
          </h2>

        </Card>


      </div>





      {/* Tabs */}


      <div className="flex gap-3 mb-6">


        <Button

          variant={
            activeTab==="PENDING"
            ?
            "primary"
            :
            "secondary"
          }

          onClick={()=>{

            setActiveTab("PENDING");

            setPage(1);

          }}

        >

          Pending Recruiters

        </Button>




        <Button

          variant={
            activeTab==="APPROVED"
            ?
            "primary"
            :
            "secondary"
          }


          onClick={()=>{

            setActiveTab("APPROVED");

            setPage(1);

          }}

        >

          Approved Recruiters

        </Button>




        <Button

          variant={
            activeTab==="REJECTED"
            ?
            "primary"
            :
            "secondary"
          }


          onClick={()=>{

            setActiveTab("REJECTED");

            setPage(1);

          }}

        >

          Rejected

        </Button>


      </div>






      {/* Recruiter List */}



      {currentRecruiters.length===0 ? (


        <Card>

          <EmptyState

            icon="🏢"

            title="No recruiters found"

            description={
              activeTab==="PENDING"
              ?
              "No recruiters are waiting for approval."
              :
              "No recruiters available."
            }

          />


        </Card>



      ) : (



        <Card>


          <div className="overflow-x-auto">


            <table className="w-full">


              <thead>


                <tr className="border-b">


                  <th className="text-left py-3">
                    Company
                  </th>


                  <th className="text-left py-3">
                    Recruiter
                  </th>


                  <th className="text-left py-3">
                    Email
                  </th>


                  <th className="text-left py-3">
                    Industry
                  </th>


                  <th className="text-left py-3">
                    Status
                  </th>


                  <th className="text-center py-3">
                    Actions
                  </th>


                </tr>


              </thead>

<tbody>
  {currentRecruiters.map((r) => (
    <tr
      key={r.id}
      className="border-b hover:bg-gray-50 transition"
    >
      <td className="py-4">
        <p className="font-semibold">
          {r.companyName}
        </p>
      </td>

      <td>
        <p className="font-medium">
          {r.fullName}
        </p>

        <p className="text-xs text-gray-500">
          {r.designation}
        </p>
      </td>

      <td>
        <p className="text-sm">
          {r.email}
        </p>

        <p className="text-xs text-gray-500">
          {r.mobileNumber}
        </p>
      </td>

      <td>
        {r.industry || "N/A"}
      </td>

      <td>
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
            r.status === "APPROVED"
              ? "bg-green-100 text-green-700"
              : r.status === "REJECTED"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {r.status}
        </span>
      </td>

      <td>
        <div className="flex justify-center gap-2">

          {r.status === "PENDING" && (
            <>
              <Button
                onClick={() =>
                  updateStatus(r.id, "approve")
                }
              >
                Approve
              </Button>

              <Button
                variant="danger"
                onClick={() =>
                  updateStatus(r.id, "reject")
                }
              >
                Reject
              </Button>
            </>
          )}

          {r.status === "APPROVED" && (
            <Button
              variant="secondary"
              onClick={() =>
                navigate(`/admin/recruiters/${r.id}`)
              }
            >
              View
            </Button>
          )}

          <Button
            variant="danger"
            onClick={() =>
              deleteRecruiter(r.id)
            }
          >
            Delete
          </Button>

        </div>
      </td>

    </tr>
  ))}
</tbody>

</table>

</div>

</Card>

)}

{/* Pagination */}

{totalPages > 1 && (
  <div className="flex justify-center items-center gap-3 mt-8">

    <Button
      variant="secondary"
      disabled={page === 1}
      onClick={() =>
        setPage(prev => prev - 1)
      }
    >
      Previous
    </Button>

    <span className="font-semibold">
      Page {page} of {totalPages}
    </span>

    <Button
      variant="secondary"
      disabled={page === totalPages}
      onClick={() =>
        setPage(prev => prev + 1)
      }
    >
      Next
    </Button>

  </div>
) }

</FullWidthListLayout>
  );
};