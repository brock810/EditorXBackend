package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-sql-driver/mysql"
	"github.com/rs/cors"
)

var db *sql.DB

func main() {
	// MySQL configuration
	mysqlConfig := &mysql.Config{
		User:   "root",
		Passwd: "password",
		Net:    "tcp",
		Addr:   "localhost:3306",
		DBName: "code_editor",
	}

	var err error
	db, err = sql.Open("mysql", mysqlConfig.FormatDSN())
	if err != nil {
		fmt.Println("Error opening database connection:", err)
		return
	}
	defer db.Close()

	// Test the database connection
	if err := db.Ping(); err != nil {
		fmt.Println("Error connecting to the database:", err)
		return
	}

	http.HandleFunc("/deleteCodeFromDatabase", deleteCodeFromDatabaseHandler)
	http.HandleFunc("/notifyCommit", notifyCommitHandler)
	http.HandleFunc("/notifyFileChange", notifyFileChangeHandler)
	http.HandleFunc("/saveCodeToDatabase", saveCodeToDatabaseHandler)

	// Set up CORS middleware
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
		Debug:            true,
		AllowedHeaders:   []string{"Content-Type"},
	}).Handler(http.DefaultServeMux)

	// Serve HTTP with CORS
	fmt.Println("HTTP server starting on port 8082...") // Changed port number to 8082
	if err := http.ListenAndServe(":8082", corsHandler); err != nil {
		fmt.Println("Error starting HTTP server:", err)
	}
}

func notifyCommitHandler(w http.ResponseWriter, r *http.Request) {
	// Notify clients about new commits
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Notification sent"})
}

func notifyFileChangeHandler(w http.ResponseWriter, r *http.Request) {
	// Notify clients about file changes
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Notification sent"})
}

func saveCodeToDatabaseHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse JSON request body
	var data map[string]string
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, fmt.Sprintf("Invalid request body: %v", err), http.StatusBadRequest)
		return
	}

	// Log the received data
	fmt.Printf("Received data: %v\n", data)

	// Ensure that the "code" field is provided in the request
	code, exists := data["code"]
	if !exists {
		http.Error(w, "Code not provided", http.StatusBadRequest)
		return
	}

	// Log the extracted code
	fmt.Printf("Received code: %s\n", code)

	// Check if the code is empty
	if code == "" {
		http.Error(w, "Code cannot be empty", http.StatusBadRequest)
		return
	}

	// Insert the code into the database
	_, err := db.Exec("INSERT INTO code_changes (code_changes) VALUES (?)", code)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error saving code to database: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Code saved successfully"})
}

func deleteCodeFromDatabaseHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8080")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse JSON request body
	var data map[string]string
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, fmt.Sprintf("Invalid request body: %v", err), http.StatusBadRequest)
		return
	}

	// Log the received data
	fmt.Printf("Received data for deletion: %v\n", data)

	// Ensure that the "code" field is provided in the request
	code, exists := data["code"]
	if !exists {
		http.Error(w, "Code not provided", http.StatusBadRequest)
		return
	}

	// Log the extracted code
	fmt.Printf("Received code for deletion: %s\n", code)

	// Check if the code is empty
	if code == "" {
		http.Error(w, "Code cannot be empty", http.StatusBadRequest)
		return
	}

	// Delete the code from the database
	_, err := db.Exec("DELETE FROM code_changes WHERE code_changes = ?", code)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error deleting code from database: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Code deleted successfully"})
}
