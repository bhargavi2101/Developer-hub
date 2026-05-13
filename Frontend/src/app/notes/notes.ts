import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RoadmapService } from '../roadmap-service';

interface UserNote {
  _id: string;
  userId: string;
  roadmapId: string;
  subTechnologyId: string;
  title: string;
  content: string;
  tags: string[];
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  lastAccessed: string;
  wordCount: number;
}

@Component({
  selector: 'app-notes',
  standalone: false,
  templateUrl: './notes.html',
  styleUrl: './notes.css',
})
export class Notes implements OnInit {
  notes: UserNote[] = [];
  filteredNotes: UserNote[] = [];
  currentNote: UserNote | null = null;
  isLoading = false;
  errorMessage = '';

  // Filter states
  selectedTag = 'all';
  searchQuery = '';
  currentRoadmapId = '';

  // Editor states
  isEditing = false;
  editMode = 'view'; // 'view', 'edit', 'create'

  // Form data
  noteForm = {
    _id: '',
    title: '',
    content: '',
    tags: [] as string[],
    isPrivate: true
  };

  constructor(
    private roadmapService: RoadmapService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['roadmapId']) {
        this.currentRoadmapId = params['roadmapId'];
      }
    });
    this.loadNotes();
  }

  loadNotes() {
    this.isLoading = true;
    this.errorMessage = '';

    this.roadmapService.getUserNotes({
      roadmapId: this.currentRoadmapId
    }).subscribe({
      next: (res: any) => {
        console.log('Notes loaded:', res);
        this.notes = res || [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading notes:', err);
        this.errorMessage = 'Failed to load notes';
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    this.filteredNotes = this.notes.filter(note => {
      // Tag filter
      const tagMatch = this.selectedTag === 'all' ||
        (this.selectedTag && note.tags.includes(this.selectedTag));

      // Search filter
      const searchMatch = !this.searchQuery ||
        note.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(this.searchQuery.toLowerCase());

      return tagMatch && searchMatch;
    });
  }

  getAllTags(): string[] {
    const allTags = new Set<string>();
    this.notes.forEach(note => {
      note.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  }

  createNewNote() {
    this.noteForm = {
      _id: '',
      title: '',
      content: '',
      tags: [],
      isPrivate: true
    };
    this.editMode = 'create';
    this.isEditing = true;
  }

  editNote(note: UserNote) {
    this.noteForm = {
      _id: note._id,
      title: note.title,
      content: note.content,
      tags: [...note.tags],
      isPrivate: note.isPrivate
    };
    this.editMode = 'edit';
    this.isEditing = true;
  }

  viewNote(note: UserNote) {
    this.currentNote = note;
    this.editMode = 'view';
    this.isEditing = false;
  }

  closeEditor() {
    this.isEditing = false;
    this.editMode = 'view';
    this.noteForm = {
      _id: '',
      title: '',
      content: '',
      tags: [],
      isPrivate: true
    };
  }

  saveNote() {
    if (!this.noteForm.content.trim()) {
      alert('Note content is required');
      return;
    }

    const noteData = {
      roadmapId: this.currentRoadmapId,
      subTechnologyId: this.currentNote?.subTechnologyId || '',
      title: this.noteForm.title,
      content: this.noteForm.content,
      tags: this.noteForm.tags,
      isPrivate: this.noteForm.isPrivate
    };

    const saveObservable = this.editMode === 'create'
      ? this.roadmapService.createNote(noteData)
      : this.roadmapService.updateNote(this.noteForm._id, noteData);

    saveObservable.subscribe({
      next: (res: any) => {
        console.log('Note saved:', res);
        this.loadNotes();
        this.closeEditor();
        alert(this.editMode === 'create' ? 'Note created successfully!' : 'Note updated successfully!');
      },
      error: (err) => {
        console.error('Error saving note:', err);
        alert('Failed to save note');
      }
    });
  }

  deleteNote(noteId: string) {
    if (confirm('Are you sure you want to delete this note?')) {
      this.roadmapService.deleteNote(noteId).subscribe({
        next: () => {
          console.log('Note deleted');
          this.loadNotes();
          if (this.currentNote?._id === noteId) {
            this.currentNote = null;
            this.editMode = 'view';
          }
          alert('Note deleted successfully');
        },
        error: (err) => {
          console.error('Error deleting note:', err);
          alert('Failed to delete note');
        }
      });
    }
  }

  addTag(tag: string) {
    const tagName = tag.trim();
    if (tagName && !this.noteForm.tags.includes(tagName)) {
      this.noteForm.tags.push(tagName);
    }
  }

  removeTag(index: number) {
    this.noteForm.tags.splice(index, 1);
  }

  setTag(tag: string) {
    this.selectedTag = tag;
    this.applyFilters();
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.applyFilters();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  getWordCount(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  backToRoadmaps() {
    this.router.navigate(['/roadmaps']);
  }
}