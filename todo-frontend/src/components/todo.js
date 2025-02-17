import { useEffect, useState } from "react";

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDesciption] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);

    // Edit
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDesciption] = useState("");

    const apiUrl = "http://localhost:8000";
    
    const handleSubmit = () => {
        setError("");
        // Check if title or description is empty
        if (title.trim() === "" || description.trim() === "") {
            setError("Please provide both title and description.");
            return;
        }

        // If fields are valid, proceed with submitting
        fetch(apiUrl + "/todos", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        }).then((res) => {
            if (res.ok) {
                // Add item to the list
                setTodos([...todos, { title, description }]);
                setTitle("");
                setDesciption("");
                setMessage("Item added successfully");
                setTimeout(() => {
                    setMessage("");
                }, 3000);
            } else {
                // Set error if failed
                setError("Unable to create Todo item");
            }
        }).catch(() => {
            setError("Unable to create Todo item");
        });
    };

    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        fetch(apiUrl + "/todos")
            .then((res) => res.json())
            .then((res) => {
                setTodos(res);
            });
    };

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDesciption(item.description);
    };

    const handleUpdate = () => {
        setError("");
        // Check if edit title or description is empty
        if (editTitle.trim() === "" || editDescription.trim() === "") {
            setError("Please provide both title and description.");
            return;
        }

        fetch(apiUrl + "/todos/" + editId, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: editTitle, description: editDescription })
        }).then((res) => {
            if (res.ok) {
                // Update item in the list
                const updatedTodos = todos.map((item) => {
                    if (item._id === editId) {
                        item.title = editTitle;
                        item.description = editDescription;
                    }
                    return item;
                });

                setTodos(updatedTodos);
                setEditTitle("");
                setEditDesciption("");
                setMessage("Item updated successfully");
                setTimeout(() => {
                    setMessage("");
                }, 3000);

                setEditId(-1);
            } else {
                setError("Unable to update Todo item");
            }
        }).catch(() => {
            setError("Unable to update Todo item");
        });
    };

    const handleEditCancel = () => {
        setEditId(-1);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete?')) {
            fetch(apiUrl + '/todos/' + id, {
                method: "DELETE"
            })
            .then(() => {
                const updatedTodos = todos.filter((item) => item._id !== id);
                setTodos(updatedTodos);
            });
        }
    };

    return (
        <>
            <div className="container m-auto mt-5 p-5" style={{ backgroundColor: "black" }}>
                <div className="row p-3 bg-success text-light">
                    <h1 className="fw-bolder">ToDo List</h1>
                </div>
                <div className="row">
                    <h3 className="mt-3 mb-3 text-light">Add Item</h3>
                    {message && <p className="text-success">{message}</p>}
                    <div className="form-group d-flex gap-2">
                        <input
                            placeholder="Title"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                            className="form-control"
                            type="text"
                        />
                        <input
                            placeholder="Description"
                            onChange={(e) => setDesciption(e.target.value)}
                            value={description}
                            className="form-control"
                            type="text"
                        />
                        <button className="btn btn-primary" onClick={handleSubmit}>
                            Add
                        </button>
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                </div>
                <div className="row mt-3">
                    <h3 className="text-light">Tasks</h3>
                    <div className="col-md-12 col-md-6">
                        <ul className="list-group">
                            {todos.map((item) => (
                                <li
                                    className="list-group-item bg-info w-100 d-flex justify-content-between align-items-center my-2"
                                    key={item._id}
                                >
                                    <div className="d-flex flex-column me-2">
                                        {editId === -1 || editId !== item._id ? (
                                            <>
                                                <span className="fw-bold">{item.title}</span>
                                                <span>{item.description}</span>
                                            </>
                                        ) : (
                                            <div className="form-group d-flex gap-2">
                                                <input
                                                    placeholder="Title"
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    value={editTitle}
                                                    className="form-control"
                                                    type="text"
                                                />
                                                <input
                                                    placeholder="Description"
                                                    onChange={(e) => setEditDesciption(e.target.value)}
                                                    value={editDescription}
                                                    className="form-control"
                                                    type="text"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="d-flex gap-2">
                                        {editId === -1 ? (
                                            <>
                                                <button
                                                    className="btn btn-warning"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => handleDelete(item._id)}
                                                >
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="btn btn-warning"
                                                    onClick={handleUpdate}
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={handleEditCancel}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
