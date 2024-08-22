provider "google" {
  project = "kubernetes-428901"
  region  = "us-central1"
  zone    = "us-central1-c"
}

resource "google_container_cluster" "primary" {
  name     = "kubernetes-assignment-cluster"
  location = "us-central1-c"

  initial_node_count = 1

  node_config {
    machine_type = "e2-small"

    disk_size_gb = 10
  }

  deletion_protection = false
}