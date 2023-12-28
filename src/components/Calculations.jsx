import { useContext, useEffect, useState } from "preact/hooks";

import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase"; // Assuming you have already set up the Firebase connection

const Calculations = ({ currentUser }) => {
  const [calculations, setCalculations] = useState(null);
  const isDemoTariff =
    (new Date() - currentUser.metadata.createdAt) / 1000 / 60 / 60 / 24 <= 5;
  const fetchCalculations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "calculations"));
      const calculations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCalculations(calculations);
    } catch (error) {
      console.error("Error fetching calculations:", error);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      await deleteDoc(doc(db, "calculations", documentId));
      fetchCalculations();
      console.log("Document deleted successfully");
      // Perform any additional actions after deleting the document
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };
  useEffect(() => {
    fetchCalculations();
  }, []);
  return (
    <div>
      <div className=" row">
        <span className="blue-text">{currentUser.phoneNumber}</span>
      </div>
      <div className=" row">
        <span>Текущий тариф: </span>
        <span className="blue-text">{isDemoTariff ? "DEMO" : "Free"}</span>
      </div>
      {isDemoTariff && (
        <div className=" row">
          <span>Осталось дней: </span>
          <span className="">
            {Math.ceil(
              5 -
                (new Date() - currentUser.metadata.createdAt) /
                  1000 /
                  60 /
                  60 /
                  24
            )}
          </span>
        </div>
      )}

      {isDemoTariff && (
        <>
          <div className=" row">
            <span>Рассчеты</span>
          </div>

          {calculations?.map(({ calculation, document, createdAt, id }) => (
            <>
              <div className=" valign-wrapper">
                <time dateTime="2022-01-01">
                  {new Date(
                    createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000
                  ).toLocaleDateString()}
                </time>
              </div>
              <div className="">
                <button
                  class="btn-floating btn-small waves-effect waves-light "
                  onClick={() => {
                    setData({
                      calculation,
                      document,
                    });
                  }}
                >
                  edit
                </button>
                <button class="btn-floating btn-small waves-effect waves-light ">
                  email
                </button>{" "}
                <button
                  onClick={() => handleDeleteDocument(id)}
                  class="btn-floating btn-small waves-effect waves-light blue"
                >
                  delete
                </button>
              </div>
            </>
          ))}
        </>
      )}
    </div>
  );
};

export default Calculations;
