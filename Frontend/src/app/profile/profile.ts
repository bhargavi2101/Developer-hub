import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth-service';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';

interface UserProfile {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  skills?: string[];
  interests?: string[];
  learningGoals?: string[];
}

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  userProfile: UserProfile = {
    username: '',
    email: ''
  };

  isEditing = false;
  isLoading = false;
  errorMessage = '';

  profileForm = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    bio: '',
    avatar: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    skills: [] as string[],
    interests: [] as string[],
    learningGoals: [] as string[]
  };

  // Avatar upload properties
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  isUploading: boolean = false;
  dragOver: boolean = false;

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  showPasswordForm = false;
  passwordError = '';

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.getUserProfile().subscribe({
      next: (res: any) => {
        console.log('User profile loaded:', res);
        this.userProfile = res;
        this.initializeForm();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.errorMessage = 'Failed to load profile. Please try again.';
        this.isLoading = false;
      }
    });
  }

  initializeForm() {
    this.profileForm = {
      username: this.userProfile.username,
      email: this.userProfile.email,
      firstName: this.userProfile.firstName || '',
      lastName: this.userProfile.lastName || '',
      bio: this.userProfile.bio || '',
      avatar: this.userProfile.avatar || '',
      location: this.userProfile.location || '',
      website: this.userProfile.website || '',
      github: this.userProfile.github || '',
      linkedin: this.userProfile.linkedin || '',
      skills: this.userProfile.skills || [],
      interests: this.userProfile.interests || [],
      learningGoals: this.userProfile.learningGoals || []
    };
  }

  // Avatar upload methods
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.validateAndSelectFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.validateAndSelectFile(file);
    }
  }

  validateAndSelectFile(file: File) {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, JPG, PNG, GIF, WEBP)');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    this.selectedFile = file;
    // Auto-upload the selected file
    this.uploadAvatar();
  }

  uploadAvatar() {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.uploadProgress = 0;

    const formData = new FormData();
    formData.append('avatar', this.selectedFile);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.post('http://localhost:3000/api/upload/avatar', formData, {
      headers,
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          console.log('Avatar uploaded successfully:', event.body);
          this.userProfile.avatar = event.body.avatarUrl;
          this.isUploading = false;
          this.uploadProgress = 0;
          this.selectedFile = null;
          alert('Avatar uploaded successfully!');
        }
      },
      error: (err) => {
        console.error('Error uploading avatar:', err);
        this.isUploading = false;
        this.uploadProgress = 0;
        this.selectedFile = null;
        alert(err.error?.msg || 'Failed to upload avatar. Please try again.');
      }
    });
  }

  // Helper methods for array fields
  addSkill() {
    const skill = prompt('Enter a skill:');
    if (skill && skill.trim()) {
      this.profileForm.skills.push(skill.trim());
    }
  }

  removeSkill(index: number) {
    this.profileForm.skills.splice(index, 1);
  }

  addInterest() {
    const interest = prompt('Enter an interest:');
    if (interest && interest.trim()) {
      this.profileForm.interests.push(interest.trim());
    }
  }

  removeInterest(index: number) {
    this.profileForm.interests.splice(index, 1);
  }

  addLearningGoal() {
    const goal = prompt('Enter a learning goal:');
    if (goal && goal.trim()) {
      this.profileForm.learningGoals.push(goal.trim());
    }
  }

  removeLearningGoal(index: number) {
    this.profileForm.learningGoals.splice(index, 1);
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.initializeForm();
    }
  }

  saveProfile() {
    if (!this.profileForm.username || !this.profileForm.email) {
      this.errorMessage = 'Username and email are required';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.updateUserProfile(this.profileForm).subscribe({
      next: (res: any) => {
        console.log('Profile updated:', res);
        this.userProfile = res.user;
        this.isEditing = false;
        this.isLoading = false;
        alert('Profile updated successfully!');
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.errorMessage = err.error?.msg || 'Failed to update profile';
        this.isLoading = false;
      }
    });
  }

  togglePasswordForm() {
    this.showPasswordForm = !this.showPasswordForm;
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.passwordError = '';
  }

  changePassword() {
    if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword) {
      this.passwordError = 'Please fill in all password fields';
      return;
    }

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.passwordError = 'New passwords do not match';
      return;
    }

    if (this.passwordForm.newPassword.length < 6) {
      this.passwordError = 'New password must be at least 6 characters long';
      return;
    }

    this.isLoading = true;
    this.passwordError = '';

    this.authService.changePassword({
      currentPassword: this.passwordForm.currentPassword,
      newPassword: this.passwordForm.newPassword
    }).subscribe({
      next: (res: any) => {
        console.log('Password changed:', res);
        this.isLoading = false;
        this.showPasswordForm = false;
        alert('Password changed successfully!');
      },
      error: (err) => {
        console.error('Error changing password:', err);
        this.passwordError = err.error?.msg || 'Failed to change password';
        this.isLoading = false;
      }
    });
  }

  cancelEdit() {
    this.isEditing = false;
    this.initializeForm();
  }
}
