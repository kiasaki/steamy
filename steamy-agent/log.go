package main

import "time"

type LogEvent struct {
	Message   string
	Timestamp time.Time
}

var logs = []*LogEvent{}

// Log an event the agent handled
func logEvent(message string) {
	logs = append([]*LogEvent{&LogEvent{
		Message:   message,
		Timestamp: time.Now(),
	}}, logs...)
}

// Returns recent logs bound by a limit.
//
// If -1 is given all logs are returned
func recentLogs(limit int) []*LogEvent {
	if limit == -1 {
		return logs
	}
	return logs[0:limit]
}
