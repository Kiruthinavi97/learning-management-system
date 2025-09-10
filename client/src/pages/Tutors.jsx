import axios from "./Helpers/axiosInstance";

export default function Tutors() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await axios.get("/tutors");
        setTutors(res.data?.tutors || []);
      } catch (err) {
        console.error("Error fetching tutors:", err);
        setError("Failed to load tutors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  if (loading) return <div>Loading tutors...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Available Tutors</h2>

      {tutors.length === 0 ? (
        <div>No tutors found</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tutors.map((tutor) => (
            <li
              key={tutor._id}
              style={{
                marginBottom: "15px",
                border: "1px solid #ccc",
                padding: "12px",
                borderRadius: "8px",
              }}
            >
              <strong>{tutor.name}</strong> ({tutor.email}) <br />
              <span>
                <b>Subjects:</b>{" "}
                {tutor.subjects?.length > 0
                  ? tutor.subjects.join(", ")
                  : "Not specified"}
              </span>
              <br />
              <span>
                <b>Rate:</b> {tutor.hourlyRate ? `₹${tutor.hourlyRate}/hr` : "N/A"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
