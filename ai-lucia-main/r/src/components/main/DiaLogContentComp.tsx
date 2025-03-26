import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";

import { useEffect, useState } from "react";
import axios from "axios";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useNavigate } from "react-router-dom";

const DialogContentComp = ({ data, label }: { data: any; label: string }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  let defaultValues;
  data
    ? (defaultValues = {
        dueDate: data.dueDate,
        category: data.category,
        priority: data.priority,
        title: data.title,
        description: data.description,
      })
    : (defaultValues = {
        dueDate: "",
        category: "",
        priority: "",
        title: "",
        description: "",
      });

  //   const [submitFields, setSubmitFields] = useState({
  //     dueDate: "",
  //     category: "",
  //     priority: "",
  //     title: "",
  //     description: "",
  //   });
  console.log("defaultValueskraixa", defaultValues);
  const [submitFields, setSubmitFields] = useState({
    dueDate: "",
    category: "",
    priority: "",
    title: "",
    description: "",
  });
  useEffect(() => {
    if (data) {
      setSubmitFields({
        dueDate: data.dueDate,
        category: data.category,
        priority: data.priority,
        title: data.title,
        description: data.description,
      });
    }
  }, [data]);
  const handleDateSelect: any = (selectedDate: Date | null) => {
    if (selectedDate) {
      setSubmitFields((prevState) => ({
        ...prevState,
        dueDate: selectedDate.toISOString(),
      }));
    }
  };
  const handleInputChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      setSubmitFields((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    };
  const handleSelectChange = (field: string, value: string) => {
    setSubmitFields((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const submitFunction = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/postTodo`,
        submitFields,
        {
          withCredentials: true,
        }
      );
      toast.success("Todo Added");
      queryClient.invalidateQueries({ queryKey: ["todoData"] });
      navigate("/");
    } catch (error) {
      toast.error("Failed To Add Todo");
      console.error(error);
    }
  };
  return (
    <div className="grid grid-cols-[1fr_50rem] gap-5">
      <div
        className={`${
          label === "Submit" ? "bg-sidebar" : null
        } flex flex-col gap-10`}
      >
        <Calendar
          mode="single"
          selected={
            submitFields.dueDate ? new Date(submitFields.dueDate) : undefined
          }
          onSelect={handleDateSelect}
          disabled={(date) => date < new Date()}
          className="rounded-md border p-10"
        />
        <div className="flex flex-col gap-5">
          <div className="w-full flex justify-center">
            <Select
              value={submitFields.category}
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full flex justify-center mb-10">
            <Select
              value={submitFields.priority}
              onValueChange={(value) => handleSelectChange("priority", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="p-10 flex flex-col gap-8">
        <label htmlFor="title" className="font-extrabold text-2xl">
          Title
        </label>
        <Input
          value={submitFields.title}
          onChange={handleInputChange("title")}
          placeholder="Title"
          className="font-bold h-30"
        ></Input>
        <label htmlFor="description" className="font-extrabold text-2xl">
          Description
        </label>
        <Textarea
          value={submitFields.description}
          onChange={handleInputChange("description")}
          placeholder="Description"
          className="font-bold h-full"
        ></Textarea>
        <div className="mt-5 flex justify-end">
          <Button onClick={submitFunction}>{label}</Button>
        </div>
      </div>
    </div>
  );
};
export default DialogContentComp;
