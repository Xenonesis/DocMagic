/**
 * Document Comparison Service
 * Compare different versions or templates with detailed diff analysis
 */

import { diffChars, diffWords, diffLines, diffSentences, Change } from 'diff';

export interface ComparisonOptions {
  mode?: 'chars' | 'words' | 'lines' | 'sentences';
  ignoreWhitespace?: boolean;
  ignoreCase?: boolean;
  contextLines?: number;
}

export interface ComparisonResult {
  changes: Change[];
  statistics: {
    additions: number;
    deletions: number;
    modifications: number;
    unchanged: number;
    totalChanges: number;
    changePercentage: number;
  };
  summary: string;
}

export interface SideBySideComparison {
  left: Array<{ content: string; type: 'added' | 'removed' | 'unchanged' | 'modified' }>;
  right: Array<{ content: string; type: 'added' | 'removed' | 'unchanged' | 'modified' }>;
}

class DocumentComparisonService {
  /**
   * Compare two documents and return detailed diff
   */
  compareDocuments(
    originalContent: string,
    modifiedContent: string,
    options: ComparisonOptions = {}
  ): ComparisonResult {
    const {
      mode = 'words',
      ignoreWhitespace = false,
      ignoreCase = false,
    } = options;

    // Preprocess content
    let original = originalContent;
    let modified = modifiedContent;

    if (ignoreWhitespace) {
      original = original.replace(/\s+/g, ' ').trim();
      modified = modified.replace(/\s+/g, ' ').trim();
    }

    if (ignoreCase) {
      original = original.toLowerCase();
      modified = modified.toLowerCase();
    }

    // Perform diff based on mode
    let changes: Change[];
    switch (mode) {
      case 'chars':
        changes = diffChars(original, modified);
        break;
      case 'lines':
        changes = diffLines(original, modified);
        break;
      case 'sentences':
        changes = diffSentences(original, modified);
        break;
      case 'words':
      default:
        changes = diffWords(original, modified);
        break;
    }

    // Calculate statistics
    const statistics = this.calculateStatistics(changes);
    const summary = this.generateSummary(statistics);

    return {
      changes,
      statistics,
      summary,
    };
  }

  /**
   * Generate side-by-side comparison view
   */
  generateSideBySide(
    originalContent: string,
    modifiedContent: string,
    options: ComparisonOptions = {}
  ): SideBySideComparison {
    const result = this.compareDocuments(originalContent, modifiedContent, options);
    
    const left: Array<{ content: string; type: any }> = [];
    const right: Array<{ content: string; type: any }> = [];

    result.changes.forEach((change) => {
      if (change.removed) {
        left.push({ content: change.value, type: 'removed' });
      } else if (change.added) {
        right.push({ content: change.value, type: 'added' });
      } else {
        left.push({ content: change.value, type: 'unchanged' });
        right.push({ content: change.value, type: 'unchanged' });
      }
    });

    return { left, right };
  }

  /**
   * Get unified diff format (like git diff)
   */
  getUnifiedDiff(
    originalContent: string,
    modifiedContent: string,
    options: ComparisonOptions = {}
  ): string {
    const result = this.compareDocuments(originalContent, modifiedContent, { ...options, mode: 'lines' });
    
    const lines: string[] = ['--- Original', '+++ Modified', ''];
    
    result.changes.forEach((change) => {
      const prefix = change.added ? '+' : change.removed ? '-' : ' ';
      const content = change.value.split('\n');
      
      content.forEach((line, index) => {
        if (line || index < content.length - 1) {
          lines.push(prefix + line);
        }
      });
    });

    return lines.join('\n');
  }

  /**
   * Highlight changes in HTML format
   */
  generateHTMLDiff(
    originalContent: string,
    modifiedContent: string,
    options: ComparisonOptions = {}
  ): string {
    const result = this.compareDocuments(originalContent, modifiedContent, options);
    
    const html: string[] = [];
    
    result.changes.forEach((change) => {
      const escapedValue = this.escapeHtml(change.value);
      
      if (change.added) {
        html.push(`<ins class="bg-green-200 dark:bg-green-900">${escapedValue}</ins>`);
      } else if (change.removed) {
        html.push(`<del class="bg-red-200 dark:bg-red-900 line-through">${escapedValue}</del>`);
      } else {
        html.push(escapedValue);
      }
    });

    return html.join('');
  }

  /**
   * Calculate statistics from changes
   */
  private calculateStatistics(changes: Change[]): ComparisonResult['statistics'] {
    let additions = 0;
    let deletions = 0;
    let unchanged = 0;

    changes.forEach((change) => {
      const count = change.value.length;
      
      if (change.added) {
        additions += count;
      } else if (change.removed) {
        deletions += count;
      } else {
        unchanged += count;
      }
    });

    const total = additions + deletions + unchanged;
    const totalChanges = additions + deletions;
    const modifications = Math.min(additions, deletions);
    const changePercentage = total > 0 ? (totalChanges / total) * 100 : 0;

    return {
      additions: additions - modifications,
      deletions: deletions - modifications,
      modifications,
      unchanged,
      totalChanges,
      changePercentage,
    };
  }

  /**
   * Generate human-readable summary
   */
  private generateSummary(statistics: ComparisonResult['statistics']): string {
    const { additions, deletions, modifications, changePercentage } = statistics;
    
    const parts: string[] = [];
    
    if (additions > 0) parts.push(`${additions} additions`);
    if (deletions > 0) parts.push(`${deletions} deletions`);
    if (modifications > 0) parts.push(`${modifications} modifications`);
    
    if (parts.length === 0) {
      return 'No changes detected';
    }
    
    const changeDescription = parts.join(', ');
    return `${changeDescription} (${changePercentage.toFixed(1)}% changed)`;
  }

  /**
   * Escape HTML special characters
   */
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  /**
   * Compare multiple documents
   */
  compareMultiple(
    documents: Array<{ id: string; name: string; content: string }>,
    baselineId: string,
    options: ComparisonOptions = {}
  ): Array<{ id: string; name: string; comparison: ComparisonResult }> {
    const baseline = documents.find((doc) => doc.id === baselineId);
    
    if (!baseline) {
      throw new Error('Baseline document not found');
    }

    return documents
      .filter((doc) => doc.id !== baselineId)
      .map((doc) => ({
        id: doc.id,
        name: doc.name,
        comparison: this.compareDocuments(baseline.content, doc.content, options),
      }));
  }

  /**
   * Detect similarity percentage between two documents
   */
  calculateSimilarity(content1: string, content2: string): number {
    const result = this.compareDocuments(content1, content2);
    return 100 - result.statistics.changePercentage;
  }

  /**
   * Find common sections between documents
   */
  findCommonSections(
    content1: string,
    content2: string,
    minLength: number = 50
  ): Array<{ content: string; position1: number; position2: number; length: number }> {
    const result = this.compareDocuments(content1, content2, { mode: 'words' });
    const commonSections: Array<any> = [];
    
    let currentSection = '';
    let startPos1 = 0;
    let startPos2 = 0;
    let pos1 = 0;
    let pos2 = 0;

    result.changes.forEach((change) => {
      if (!change.added && !change.removed) {
        if (currentSection === '') {
          startPos1 = pos1;
          startPos2 = pos2;
        }
        currentSection += change.value;
      } else {
        if (currentSection.length >= minLength) {
          commonSections.push({
            content: currentSection,
            position1: startPos1,
            position2: startPos2,
            length: currentSection.length,
          });
        }
        currentSection = '';
      }

      if (!change.added) pos1 += change.value.length;
      if (!change.removed) pos2 += change.value.length;
    });

    if (currentSection.length >= minLength) {
      commonSections.push({
        content: currentSection,
        position1: startPos1,
        position2: startPos2,
        length: currentSection.length,
      });
    }

    return commonSections;
  }
}

// Export singleton instance
export const documentComparisonService = new DocumentComparisonService();
