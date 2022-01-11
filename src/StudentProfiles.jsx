import React, { useEffect, useState } from "react";

const StudentProfiles = () => {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState();
  const [open, setOpen] = useState(null);
  const [avg, setAvg] = useState([]);
  const [taglist, setTagList] = useState([]);
  const [tags, setTags] = useState();

  useEffect(() => {
    setLoading(true);
    loadData();
  }, []);

  // Fetch Api Data =======================
  const loadData = async () => {
    const response = await fetch("https://api.hatchways.io/assessment/students")
      .then((res) => res.json())
      .then((data) => {
        setStudentData(data.students);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Accordion ===============
  const toggle = (i) => {
    if (open === i) {
      return setOpen(null);
    }
    setOpen(i);
  };

  // tag ====================
  const handleTags = (e) => {
    setTags(e.target.value);
  };

  const addtag = (i) => {
    // let list = [];
    // const merge = (a, b) => a.concat(b);

    setTagList([...taglist, (taglist[i] = [tags])]);
    setTags("");
    console.log(taglist[i]);
    console.log(taglist);
  };

  const handleKeypress = (e, i) => {
    if (e.code === "Enter") {
      addtag(i);
      setTags("");
    }
  };

  if (loading) {
    return (
      <div>
        <h2>Data is loading...</h2>
      </div>
    );
  }

  return (
    <>
      <main className="wrapper">
        <section className="container">
          <input type="text" placeholder="Search by name" className="search-name" onChange={(e) => setSearchName(e.target.value)} />
          <input type="text" placeholder="Search by tag" className="search-name" />
          <ul className="studentProfile">
            {studentData
              .filter((value) => {
                if (searchName === "") {
                  return value;
                }
                let searchvalue = value.firstName + " " + value.lastName;
                return searchvalue.toLowerCase().indexOf(searchName) !== -1 || value.lastName.toLowerCase().indexOf(searchName) !== -1;
              })
              .map((s, i) => (
                <li key={s.id} className={open === i ? "studentdata show" : "studentdata"}>
                  <div className="profil-img">
                    <img src={s.pic} alt="student-pic" />
                  </div>
                  <div className="student-info">
                    <h1>
                      {s.firstName} {s.lastName}
                    </h1>
                    <p>Email: {s.email}</p>
                    <p>Company: {s.company}</p>
                    <p>Skill: {s.skill}</p>

                    <p>Average:{s.grades}</p>
                    <div className="grades">
                      {s.grades.map((val, i) => (
                        <p>
                          <span>Test {i + 1} :</span>
                          {val}%
                        </p>
                      ))}
                    </div>
                    <div className="tags-container">
                      <div className="tags-box">
                        {taglist.map(
                          (t, index) =>
                            i === index && (
                              <div className="tags" key={index + 1}>
                                <p>{t}</p>
                              </div>
                            )
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Add Tag"
                        className="tag-input"
                        name={"tag" + i}
                        value={tags}
                        onChange={(e) => handleTags(e)}
                        onKeyPress={(e) => handleKeypress(e, i)}
                      />
                    </div>
                  </div>
                  <div className="expand">
                    <h2 className="accordion">
                      {open === i ? <i class="fas fa-minus" onClick={() => toggle(i)}></i> : <i class="fas fa-plus" onClick={() => toggle(i)}></i>}
                    </h2>
                  </div>
                </li>
              ))}
          </ul>
        </section>
      </main>
    </>
  );
};

export default StudentProfiles;
