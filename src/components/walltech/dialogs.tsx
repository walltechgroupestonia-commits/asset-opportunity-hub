import { useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const name = z.string().trim().min(2, "Inserisci nome e cognome").max(100, "Massimo 100 caratteri");
const email = z.string().trim().email("Email non valida").max(255);
const phone = z
  .string()
  .trim()
  .min(6, "Telefono non valido")
  .max(30, "Massimo 30 caratteri")
  .regex(/^[0-9+()\s.-]+$/, "Telefono non valido");

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="mono-label text-muted-foreground">{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

type Errors = Record<string, string>;

function useFormErrors() {
  const [errors, setErrors] = useState<Errors>({});
  const validate = (schema: z.ZodTypeAny, data: unknown) => {
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return false;
    }
    setErrors({});
    return true;
  };
  return { errors, validate, setErrors };
}

/* ------------------------------- Dossier -------------------------------- */

const dossierSchema = z.object({
  goal: z.string().min(1, "Seleziona un obiettivo"),
  name,
  email,
  phone,
});

export function DossierDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [goal, setGoal] = useState("trading");
  const { errors, validate } = useFormErrors();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      goal,
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
    };
    if (!validate(dossierSchema, data)) return;
    toast.success("Richiesta inviata", {
      description: "Il Dossier Integrato sarà trasmesso entro 24 ore lavorative.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Sblocca il Dossier Integrato</DialogTitle>
          <DialogDescription>
            Ricevi la diagnosi peritale, l'analisi dei vincoli procedurali e il prospetto economico
            dettagliato.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Obiettivo dell'Operazione" error={errors["goal"]}>
            <Select value={goal} onValueChange={setGoal}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trading">Trading / Flipping Immobiliare</SelectItem>
                <SelectItem value="reddito">Messa a Reddito / Locazione</SelectItem>
                <SelectItem value="personale">Uso Personale / Prima Casa</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Nome e Cognome" error={errors["name"]}>
            <Input name="name" maxLength={100} autoComplete="name" />
          </Field>
          <Field label="Email" error={errors["email"]}>
            <Input name="email" type="email" maxLength={255} autoComplete="email" />
          </Field>
          <Field label="Telefono / WhatsApp" error={errors["phone"]}>
            <Input name="phone" maxLength={30} autoComplete="tel" />
          </Field>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="quiet" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button type="submit" variant="signal">
              Invia e Sblocca Dossier
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------- Debtor -------------------------------- */

const debtorSchema = z.object({
  name,
  email,
  phone,
  company: z.string().trim().max(150).optional(),
  procedure: z.string().trim().max(120).optional(),
  debt: z.string().trim().max(20).optional(),
});

export function DebtorDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [subject, setSubject] = useState("privato");
  const [reporter, setReporter] = useState("admin");
  const { errors, validate } = useFormErrors();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      company: String(fd.get("company") ?? ""),
      procedure: String(fd.get("procedure") ?? ""),
      debt: String(fd.get("debt") ?? ""),
    };
    if (!validate(debtorSchema, data)) return;
    toast.success("Diagnosi riservata richiesta", {
      description: "Un analista dedicato ti contatterà per la valutazione di fattibilità.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assistenza Riservata Pignoramenti e Pre-Asta</DialogTitle>
          <DialogDescription>
            Valutazione di fattibilità per l'azzeramento del debito e la chiusura della procedura in
            via stragiudiziale.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Intestatario dell'Immobile / Posizione Debitoria">
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="privato">Persona Fisica (Privato / Consumatore)</SelectItem>
                <SelectItem value="societa">
                  Società / Impresa (Soggetto Commerciale - Partner CFI)
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {subject === "societa" ? (
            <div className="space-y-4 rounded-sm border border-primary/40 bg-surface p-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-primary">Integrazione Specializzata CFI:</span>{" "}
                analisi strutturata per risanamento debito aziendale, erariale e protezione del
                patrimonio.
              </p>
              <Field label="Ragione Sociale dell'Azienda Esecutata" error={errors["company"]}>
                <Input name="company" maxLength={150} />
              </Field>
              <Field label="Chi sta effettuando la segnalazione?">
                <Select value={reporter} onValueChange={setReporter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      Amministratore / Legale Rappresentante / CFO
                    </SelectItem>
                    <SelectItem value="consulente">
                      Commercialista / Avvocato / Consulente del debitore
                    </SelectItem>
                    <SelectItem value="altro">Dipendente / Socio / Altro referente</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          ) : null}

          <Field label="Nome e Cognome del Richiedente" error={errors["name"]}>
            <Input name="name" maxLength={100} autoComplete="name" />
          </Field>
          <Field label="Email" error={errors["email"]}>
            <Input name="email" type="email" maxLength={255} autoComplete="email" />
          </Field>
          <Field label="Telefono / WhatsApp" error={errors["phone"]}>
            <Input name="phone" maxLength={30} autoComplete="tel" />
          </Field>
          <Field label="Città e RGE / Numero Procedura (se noto)" error={errors["procedure"]}>
            <Input name="procedure" maxLength={120} />
          </Field>
          <Field label="Stima approssimativa del debito totale (€)" error={errors["debt"]}>
            <Input name="debt" inputMode="numeric" maxLength={20} />
          </Field>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="quiet" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button type="submit" variant="signal">
              Richiedi Diagnosi Riservata
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------- Partner ------------------------------- */

const partnerSchema = z.object({
  entity: z.string().trim().min(2, "Inserisci il nome dell'ente").max(150),
  name,
  email,
  phone,
  notes: z.string().trim().max(1000, "Massimo 1000 caratteri").optional(),
});

export function PartnerDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [kind, setKind] = useState("banca");
  const { errors, validate } = useFormErrors();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      entity: String(fd.get("entity") ?? ""),
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      notes: String(fd.get("notes") ?? ""),
    };
    if (!validate(partnerSchema, data)) return;
    toast.success("Richiesta di partnership inviata", {
      description: "Il team accreditamento verificherà la posizione e ti risponderà a breve.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Accreditamento Partner</DialogTitle>
          <DialogDescription>
            Compila il form per accedere alla rete di collaborazione o gestire posizioni NPL/UTP.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Tipologia Ente / Servicer">
            <Select value={kind} onValueChange={setKind}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="banca">Banca / Istituto di Credito</SelectItem>
                <SelectItem value="106">Intermediario Finanziario (Art. 106 TUB)</SelectItem>
                <SelectItem value="130">Società di Cartolarizzazione (Legge 130)</SelectItem>
                <SelectItem value="115">Società Recupero Crediti (Art. 115 TULPS)</SelectItem>
                <SelectItem value="servicer">Servicer / Advisory / Altro</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Nome Ente / Banca / Servicer" error={errors["entity"]}>
            <Input name="entity" maxLength={150} />
          </Field>
          <Field label="Nome e Cognome Referente" error={errors["name"]}>
            <Input name="name" maxLength={100} autoComplete="name" />
          </Field>
          <Field label="Email Professionale" error={errors["email"]}>
            <Input name="email" type="email" maxLength={255} autoComplete="email" />
          </Field>
          <Field label="Telefono Diretto" error={errors["phone"]}>
            <Input name="phone" maxLength={30} autoComplete="tel" />
          </Field>
          <Field label="Note o Tipo Operazione" error={errors["notes"]}>
            <Textarea name="notes" maxLength={1000} rows={3} />
          </Field>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="quiet" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button type="submit" variant="signal">
              Invia Richiesta Partnership
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
